<?php namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LogController extends Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->middleware('auth');
    }

    public function index(Request $request)
    {
        $module = 'preventivi';
        $resourceId = $request->get('resource_id');

        $query = DB::table('tb_logs')->orderBy('logdate', 'desc');

        if (!empty($module)) {
            $query->where('module', $module);
        }

        if (!empty($module) && !empty($resourceId)) {
            $query->where(function ($q) use ($resourceId) {
                $q->where('note', 'like', '%ID : '.$resourceId.'%')
                    ->orWhere('note', 'like', '%with ID '.$resourceId.'%');
            });
        }

        $logs = $query->paginate(25)->appends($request->all());

        $logs->getCollection()->transform(function ($log) {
            $log->target_url = $this->resolveTargetUrl($log);
            return $log;
        });

        $modules = DB::table('tb_logs')
            ->select('module')
            ->whereNotNull('module')
            ->where('module', '!=', '')
            ->distinct()
            ->orderBy('module')
            ->pluck('module')
            ->toArray();

        return view('logs.index', [
            'logs' => $logs,
            'modules' => $modules,
            'selectedModule' => $module,
            'selectedResourceId' => $resourceId,
        ]);
    }

    protected function resolveTargetUrl($log)
    {
        $module = strtolower($log->module ?? '');
        $id = $this->extractRecordId($log->note ?? '');
        if (!$id) {
            return null;
        }

        $moduleMap = [
            'preventivi' => 'preventivi',
            'previnv' => 'previnv',
            'clienti' => 'clienti',
            'medici' => 'medici',
            'lavorazioni' => 'lavorazioni',
            'nonconformita' => 'nonconformita',
        ];

        if (!isset($moduleMap[$module])) {
            return null;
        }

        return url($moduleMap[$module] . '/' . $id);
    }

    protected function extractRecordId($note)
    {
        if (preg_match('/ID\\s*[:=]?\\s*([0-9,]+)/i', $note, $matches)) {
            $idPart = $matches[1];
        } elseif (preg_match('/with\\s+ID\\s+([0-9]+)/i', $note, $matches)) {
            $idPart = $matches[1];
        } else {
            return null;
        }

        $idPart = explode(',', $idPart)[0];
        $id = (int) trim($idPart);

        return $id > 0 ? $id : null;
    }
}

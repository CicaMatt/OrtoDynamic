<?php namespace App\Http\Controllers;

use App\Models\Previnv;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator as Paginator;
use Validator, Input, Redirect ; 


class PrevinvController extends Controller {

	protected $layout = "layouts.main";
	protected $data = array();	
	public $module = 'previnv';
	static $per_page	= '10';

	public function __construct()
	{		
		parent::__construct();
		$this->model = new Previnv();	
		
		$this->info = $this->model->makeInfo( $this->module);	
		$this->data = array(
			'pageTitle'	=> 	$this->info['title'],
			'pageNote'	=>  $this->info['note'],
			'pageModule'=> 'previnv',
			'return'	=> self::returnUrl()
			
		);
		
	}

	public function index( Request $request )
	{
		// Make Sure users Logged 
		if(!\Auth::check()) 
			return redirect('user/login')->with('status', 'error')->with('message','You are not login');
		$this->grab( $request) ;
		if($this->access['is_view'] ==0) 
			return redirect('dashboard')->with('message', __('core.note_restric'))->with('status','error');				

		$ids = collect($this->data['rowData'] ?? [])->pluck('id')->filter()->values()->all();
		$this->data['stateLogs'] = $this->fetchStateLogs($ids);

		// Render into template
		return view( $this->module.'.index',$this->data);
	}	

	function create( Request $request , $id =0 ) 
	{
		$this->hook( $request  );
		if($this->access['is_add'] ==0) 
			return redirect('dashboard')->with('message', __('core.note_restric'))->with('status','error');

		$this->data['row'] = $this->model->getColumnTable( $this->info['table']); 
		
		$this->data['id'] = '';
		return view($this->module.'.form',$this->data);
	}
	function edit( Request $request , $id ) 
	{
		$this->hook( $request , $id );
		if(!isset($this->data['row']))
			return redirect($this->module)->with('message','Record Not Found !')->with('status','error');
		if($this->access['is_edit'] ==0 )
			return redirect('dashboard')->with('message',__('core.note_restric'))->with('status','error');
		$this->data['row'] = (array) $this->data['row'];
		
		$this->data['id'] = $id;
		return view($this->module.'.form',$this->data);
	}	
	function show( Request $request , $id ) 
	{
		/* Handle import , export and view */
		$task =$id ;
		switch( $task)
		{
			case 'search':
				return $this->getSearch();
				break;
			case 'lookup':
				return $this->getLookup($request );
				break;
			case 'comboselect':
				return $this->getComboselect( $request );
				break;
			case 'import':
				return $this->getImport( $request );
				break;
			case 'export':
				return $this->getExport( $request );
				break;
			default:
				$this->hook( $request , $id );
				if(!isset($this->data['row']))
					return redirect($this->module)->with('message','Record Not Found !')->with('status','error');

				if($this->access['is_detail'] ==0) 
					return redirect('dashboard')->with('message', __('core.note_restric'))->with('status','error');

				$logsMap = $this->fetchStateLogs([$id]);
				$this->data['stateLogs'] = $logsMap[$id] ?? [];

				return view($this->module.'.view',$this->data);	
				break;		
		}
	}
	function store( Request $request  )
	{
		$task = $request->input('action_task');
		switch ($task)
		{
			default:
				$rules = $this->validateForm();
				$validator = Validator::make($request->all(), $rules);
				if ($validator->passes()) 
				{
					$data = $this->validatePost( $request );
					$id = $this->model->insertRow($data , $request->input( $this->info['key']));
					
					/* Insert logs */
					$this->model->logs($request , $id);
					if(!is_null($request->input('apply')))
						return redirect( $this->module .'/'.$id.'/edit?'. $this->returnUrl() )->with('message',__('core.note_success'))->with('status','success');

					return redirect( $this->module .'?'. $this->returnUrl() )->with('message',__('core.note_success'))->with('status','success');
				} 
				else {
					return redirect($this->module.'/'. $request->input(  $this->info['key'] ).'/edit')
							->with('message',__('core.note_error'))->with('status','error')
							->withErrors($validator)->withInput();

				}
				break;
			case 'public':
				return $this->store_public( $request );
				break;

			case 'delete':
				$result = $this->destroy( $request );
				return redirect($this->module.'?'.$this->returnUrl())->with($result);
				break;

			case 'import':
				return $this->PostImport( $request );
				break;

			case 'copy':
				$result = $this->copy( $request );
				return redirect($this->module.'?'.$this->returnUrl())->with($result);
				break;		
				
			case 'changeState':
				$result = $this->changeState( $request );
				return redirect($this->module.'?'.$this->returnUrl())->with($result);
				break;

			case 'updateNote':
				$result = $this->updateNote( $request );
				return redirect($this->module.'?'.$this->returnUrl())->with($result);
				break;
		}	
	
	}	

	public function destroy( $request)
	{
		// Make Sure users Logged 
		if(!\Auth::check()) 
			return redirect('user/login')->with('status', 'error')->with('message','You are not login');

		$this->access = $this->model->validAccess($this->info['id'] , session('gid'));
		if($this->access['is_remove'] ==0) 
			return redirect('dashboard')
				->with('message', __('core.note_restric'))->with('status','error');
		// delete multipe rows 
		if(count($request->input('ids')) >=1)
		{
			$this->model->destroy($request->input('ids'));
			
			\SiteHelpers::auditTrail( $request , "ID : ".implode(",",$request->input('ids'))."  , Has Been Removed Successfull");
			// redirect
        	return ['message'=>__('core.note_success_delete'),'status'=>'success'];	
	
		} else {
			return ['message'=>__('No Item Deleted'),'status'=>'error'];				
		}

	}	
	
	public function changeState( $request)
	{
		$newState = $request->input('state');
		if(!\Auth::check()) 
			return redirect('user/login')->with('status', 'error')->with('message','You are not login');

		if(empty($newState)) {
			return ['message'=>'Stato non valido','status'=>'error'];
		}

		$ids = $request->input('ids');
		if(!is_array($ids) || count($ids) < 1) {
			return ['message'=>'Nessun elemento selezionato','status'=>'error'];
		}

		$ids = array_map('intval', $ids);
		$records = \DB::table('preventivi')->whereIn('id', $ids)->get(['id','stato']);
		if($records->isEmpty()) {
			return ['message'=>'Record non trovati','status'=>'error'];
		}

		foreach($records as $record){
			$transitionAllowed = \DB::table('stato_check')->select('id')
				->where('stato_partenza', '=', $record->stato)
				->where('stato_arrivo', '=', $newState)
				->first();
			if(!$transitionAllowed){
				return ['message'=>__('NON è POSSIBILE AGGIORNARE LO STATO'),'status'=>'error'];
			}
		}

		$updateData = ['stato' => $newState];
		if($request->exists('state_note')){
			$updateData['note_private'] = $request->input('state_note');
		}

		\DB::table('preventivi')->whereIn('id',$ids)->update($updateData);

		foreach($records as $record){
			\SiteHelpers::auditTrail( $request , 'ID : '.$record->id.'  , CAMBIATO STATO DA "'.$record->stato.'" A "'.$newState.'"' );
		}

		return ['message'=>__('STATO PREVENTIVO AGGIORNATO'),'status'=>'success'];
	}

	protected function updateNote( $request)
	{
		if(!\Auth::check()) 
			return redirect('user/login')->with('status', 'error')->with('message','You are not login');

		$id = (int) $request->input('note_record_id');
		if($id <= 0){
			return ['message'=>__('core.note_error'),'status'=>'error'];
		}

		$note = $request->input('note_value', '');
		\DB::table('preventivi')->where('id',$id)->update(['note' => $note]);
		\SiteHelpers::auditTrail( $request , "ID : ".$id."  , Nota aggiornata");

		return ['message'=>'Nota aggiornata','status'=>'success'];
	}

	protected function fetchStateLogs(array $ids)
	{
		$ids = array_values(array_unique(array_filter(array_map('intval', $ids))));
		if(empty($ids)) {
			return [];
		}

		$logs = \DB::table('tb_logs')
			->select('auditID','module','note','logdate')
			->whereIn('module',['previnv','preventivi'])
			->where(function($query){
				$query->where('note','like','%CAMBIATO STATO%')
					  ->orWhere('note','like','%Lo stato è cambiato%');
			})
			->where(function($query) use ($ids){
				foreach($ids as $id){
					$query->orWhere('note','like','%ID : '.$id.'%');
				}
			})
			->orderBy('logdate','desc')
			->get();

		$grouped = [];
		foreach($logs as $log){
			if(preg_match_all('/ID\s*:\s*([0-9]+)/', $log->note, $matches)){
				foreach($matches[1] as $matchedId){
					$matchedId = (int) $matchedId;
					if(in_array($matchedId, $ids)){
						$grouped[$matchedId][] = [
							'note' => $log->note,
							'logdate' => $log->logdate,
						];
					}
				}
			}
		}

		return $grouped;
	}
	
	public static function display(  )
	{
		$mode  = isset($_GET['view']) ? 'view' : 'default' ;
		$model  = new Previnv();
		$info = $model::makeInfo('previnv');
		$data = array(
			'pageTitle'	=> 	$info['title'],
			'pageNote'	=>  $info['note']			
		);	
		if($mode == 'view')
		{
			$id = $_GET['view'];
			$row = $model::getRow($id);
			if($row)
			{
				$data['row'] =  $row;
				$data['fields'] 		=  \SiteHelpers::fieldLang($info['config']['grid']);
				$data['id'] = $id;
				return view('previnv.public.view',$data);			
			}			
		} 
		else {

			$page = isset($_GET['page']) ? $_GET['page'] : 1;
			$params = array(
				'page'		=> $page ,
				'limit'		=>  (isset($_GET['rows']) ? filter_var($_GET['rows'],FILTER_VALIDATE_INT) : 10 ) ,
				'sort'		=> $info['key'] ,
				'order'		=> 'asc',
				'params'	=> '',
				'global'	=> 1 
			);

			$result = $model::getRows( $params );
			$data['tableGrid'] 	= $info['config']['grid'];
			$data['rowData'] 	= $result['rows'];	

			$page = $page >= 1 && filter_var($page, FILTER_VALIDATE_INT) !== false ? $page : 1;	
			$pagination = new Paginator($result['rows'], $result['total'], $params['limit']);	
			$pagination->setPath('');
			$data['i']			= ($page * $params['limit'])- $params['limit']; 
			$data['pagination'] = $pagination;
			return view('previnv.public.index',$data);	
		}

	}
	function store_public( $request)
	{
		
		$rules = $this->validateForm();
		$validator = Validator::make($request->all(), $rules);	
		if ($validator->passes()) {
			$data = $this->validatePost(  $request );		
			 $this->model->insertRow($data , $request->input('id'));
			return  Redirect::back()->with('message',__('core.note_success'))->with('status','success');
		} else {

			return  Redirect::back()->with('message',__('core.note_error'))->with('status','error')
			->withErrors($validator)->withInput();

		}	
	
	}
}

<?php namespace App\Http\Controllers;

use App\Models\Prevcons;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator as Paginator;
use Validator, Input, Redirect ; 


class PrevconsController extends Controller {

	protected $layout = "layouts.main";
	protected $data = array();	
	public $module = 'prevcons';
	static $per_page	= '10';

	public function __construct()
	{		
		parent::__construct();
		$this->model = new Prevcons();	
		
		$this->info = $this->model->makeInfo( $this->module);	
		$this->data = array(
			'pageTitle'	=> 	$this->info['title'],
			'pageNote'	=>  $this->info['note'],
			'pageModule'=> 'prevcons',
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
				
				case 'Fattura':
				$result = $this->FatturaOrdine( $request );
			    return redirect($this->module.'?'.$this->returnUrl())->with($result);
				break;
			
			
			case 'Bozza':
				$result = $this->Bozza( $request );
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
	
	public static function display(  )
	{
		$mode  = isset($_GET['view']) ? 'view' : 'default' ;
		$model  = new Prevcons();
		$info = $model::makeInfo('prevcons');
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
				return view('prevcons.public.view',$data);			
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
			return view('prevcons.public.index',$data);	
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
	
	
	
	
	
	
	
	
	//------------------------------------------
		public function FatturaOrdine( $request)
	{
		$newState = $request->input('state');
		$task = $request->input('action_task');
		// Make Sure users Logged 
		if(!\Auth::check()) 
			return redirect('user/login')->with('status', 'error')->with('message','You are not login');

		$this->access = $this->model->validAccess($this->info['id'] , session('gid'));
		if(count($request->input('ids')) >=1)
		{
		    $oldState = \DB::table('preventivi')->where('id',$request->input('ids')) ->first();
		    $numeroFattura = $request->input('nFattura');
		   
		    $idState = \DB::table('stato_check')->select('id') ->where([['stato_partenza', '=', $oldState->stato],['stato_arrivo', '=', $newState],])->first();
		    
		    if (count($idState)>=1) {
			    \DB::table('preventivi')->whereIn('id',$request->input('ids'))->update(['stato' => $newState]);
			     \DB::table('preventivi')->whereIn('id',$request->input('ids'))->update(['numero_fattura' => $numeroFattura]);
			 
			    \SiteHelpers::auditTrail( $request , "ID : ".implode(",",$request->input('ids'))."  , Lo stato è cambiato in " . $newState);
			    // redirect
        	    if ($newState == 'IN LAVORAZIONE' || $newState =='IN LAVORAZIONE SENZA AUTORIZZAZIONE')
        	    {
                    $idPreventivo = $request->input('ids');
                    if(!\Auth::check()) 
                        return redirect('user/login')->with('status', 'error')->with('message','You are not login');
                    $idCliente = \DB::table('preventivi')->where('id',$request->input('ids'))->value('id_cliente');
                    $curTime = new \DateTime();
                    $created_at = $curTime->format("Y-m-d");
                    //$id = \DB::table('lavorazioni')->insertGetId(['id_preventivo' => (int)$request->input('ids'),'id_cliente' => $idCliente,'stato' => 'IN LAVORAZIONE','data_creazione_lavorazione' => $created_at]);
                    $id = \DB::table('lavorazioni')->insertGetId(['id_preventivo' => $idPreventivo[0],'id_cliente' => $idCliente,'stato' => 'IN LAVORAZIONE','data_creazione_lavorazione' => $created_at]);
                    $items = \DB::table('item_preventivi')->where('id_preventivo', $idPreventivo[0])->get();
                    
                    foreach ($items as $item ) {
                       $codiceNomenclatore = \DB::table('nomenclatore')->where('id',$item->codice_nomenclatore)->value('codice');
                       $descrizioneNomenclatore = \DB::table('nomenclatore')->where('id',$item->codice_nomenclatore)->value('descrizione');
                       $idItem = \DB::table('item_lavorazioni')->insertGetId(['id_item_preventivi' => $item->id,'data_creazione_lavorazione' => $created_at,'importo' => $item->importo,'descrizione_nomenclatore' => $descrizioneNomenclatore,'codice_nomenclatore' => $codiceNomenclatore,'quantita'=>$item->quantita,'id_lavorazione' => $id,'stato'=>'IN LAVORAZIONE']);
                    }
                    
                    return $id; 
        	    } else
        	    {
        	      return ['message'=>__('STATO PREVENTIVO AGGIORNATO'),'status'=>'success'];   
        	    }

		    } else {
		        return ['message'=>__('NON è POSSIBILE AGGIORNARE LO STATO'),'status'=>'error'];
		    }
	
		} else {
			return ['message'=>__('No Item Deleted'),'status'=>'error'];				
		}

	}
	
	
	
	
		public function Bozza( $request)
	{
		$newState = $request->input('state');
		$task = $request->input('action_task');
		// Make Sure users Logged 
		if(!\Auth::check()) 
			return redirect('user/login')->with('status', 'error')->with('message','You are not login');

		$this->access = $this->model->validAccess($this->info['id'] , session('gid'));
		if(count($request->input('ids')) >=1)
		{
		    $oldState = \DB::table('preventivi')->where('id',$request->input('ids')) ->first();
		   
		    $idState = \DB::table('stato_check')->select('id') ->where([['stato_partenza', '=', $oldState->stato],['stato_arrivo', '=', $newState],])->first();
		    \DB::table('preventivi')->whereIn('id',$request->input('ids'))->update(['stato' => $newState]);
		    if (count($idState)>=1) {
			    
			  
			 
			    \SiteHelpers::auditTrail( $request , "ID : ".implode(",",$request->input('ids'))."  , Lo stato è cambiato in " . $newState);
			    // redirect
        	    if ($newState == 'IN LAVORAZIONE' || $newState =='IN LAVORAZIONE SENZA AUTORIZZAZIONE')
        	    {
                    $idPreventivo = $request->input('ids');
                    if(!\Auth::check()) 
                        return redirect('user/login')->with('status', 'error')->with('message','You are not login');
                    $idCliente = \DB::table('preventivi')->where('id',$request->input('ids'))->value('id_cliente');
                    $curTime = new \DateTime();
                    $created_at = $curTime->format("Y-m-d");
                    //$id = \DB::table('lavorazioni')->insertGetId(['id_preventivo' => (int)$request->input('ids'),'id_cliente' => $idCliente,'stato' => 'IN LAVORAZIONE','data_creazione_lavorazione' => $created_at]);
                    $id = \DB::table('lavorazioni')->insertGetId(['id_preventivo' => $idPreventivo[0],'id_cliente' => $idCliente,'stato' => 'IN LAVORAZIONE','data_creazione_lavorazione' => $created_at]);
                    $items = \DB::table('item_preventivi')->where('id_preventivo', $idPreventivo[0])->get();
                    
                    foreach ($items as $item ) {
                       $codiceNomenclatore = \DB::table('nomenclatore')->where('id',$item->codice_nomenclatore)->value('codice');
                       $descrizioneNomenclatore = \DB::table('nomenclatore')->where('id',$item->codice_nomenclatore)->value('descrizione');
                       $idItem = \DB::table('item_lavorazioni')->insertGetId(['id_item_preventivi' => $item->id,'data_creazione_lavorazione' => $created_at,'importo' => $item->importo,'descrizione_nomenclatore' => $descrizioneNomenclatore,'codice_nomenclatore' => $codiceNomenclatore,'quantita'=>$item->quantita,'id_lavorazione' => $id,'stato'=>'IN LAVORAZIONE']);
                    
                    }
                    
                    return $id; 
        	    } else
        	    {
        	      return ['message'=>__('STATO PREVENTIVO AGGIORNATO'),'status'=>'success'];   
        	    }

		    } else {
		         return ['message'=>__('STATO PREVENTIVO AGGIORNATO'),'status'=>'success'];
		    }
	
		} else {
			return ['message'=>__('No Item Deleted'),'status'=>'error'];				
		}

	}
	

}

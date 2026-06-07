<?php namespace App\Http\Controllers;

use App\Models\Preventivi;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator as Paginator;
use Validator, Input, Redirect ; 


class PreventiviController extends Controller {

	protected $layout = "layouts.main";
	protected $data = array();	
	public $module = 'preventivi';
	static $per_page	= '10';

	public function __construct()
	{		
		parent::__construct();
		$this->model = new Preventivi();	
		$this->modelview = new  \App\Models\Prodottipreventivi();
		$this->info = $this->model->makeInfo( $this->module);	
		$this->data = array(
			'pageTitle'	=> 	$this->info['title'],
			'pageNote'	=>  $this->info['note'],
			'pageModule'=> 'preventivi',
			'return'	=> self::returnUrl()
			
		);
		$this->data['subgrid']	= (isset($this->info['config']['subgrid']) ? $this->info['config']['subgrid'][0] : array()); 
	}

	public function index( Request $request )
	{
		// Make Sure users Logged 
		if(!\Auth::check()) 
			return redirect('user/login')->with('status', 'error')->with('message','You are not login');
		$this->grab( $request) ;
		$ids = collect($this->data['rowData'] ?? [])->pluck('id')->filter()->values()->all();
		$this->data['stateLogs'] = $this->fetchStateLogs($ids);
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
		
	 	$relation_key = $this->modelview->makeInfo($this->info['config']['subform']['module']);
	 	$this->data['accesschild'] = $this->modelview->validAccess($relation_key['id'] , session('gid'));	
	 	$this->data['relation_key'] = $relation_key['key'];
	 	$this->data['subform'] = $this->detailview($this->modelview ,  $this->info['config']['subform'] ,$id );
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
		
	 	$relation_key = $this->modelview->makeInfo($this->info['config']['subform']['module']);
	 	$this->data['accesschild'] = $this->modelview->validAccess($relation_key['id'] , session('gid'));	
	 	$this->data['relation_key'] = $relation_key['key'];
	 	$this->data['subform'] = $this->detailview($this->modelview ,  $this->info['config']['subform'] ,$id );
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
					$this->detailviewsave( $this->modelview , $request->all() ,$this->info['config']['subform'] , $id) ;
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
			case 'changeState':
				$result = $this->changeState( $request );
				return redirect($this->module.'?'.$this->returnUrl())->with($result);
				break;
			case 'updatePrivateNote':
				$result = $this->updatePrivateNote( $request );
				return redirect($this->module.'?'.$this->returnUrl())->with($result);
				break;
			case 'import':
				return $this->PostImport( $request );
				break;

			case 'copy':
				$result = $this->copy( $request );
				return redirect($this->module.'?'.$this->returnUrl())->with($result);
				break;
				
			case 'inserisciNonConformita':
				$id = $this->inserisciNonConformita( $request );
				return redirect('nonconformita/' . $id . '/edit?return=');
				break;
				
			case 'AutorizzaOrdine':
				$result = $this->AutorizzaOrdine( $request );
			    return redirect($this->module.'?'.$this->returnUrl())->with($result);
				break;
				
			case 'Fattura':
				$result = $this->FatturaOrdine( $request );
			    return redirect($this->module.'?'.$this->returnUrl())->with($result);
				break;
				
			case 'Consegna':
				$result = $this->ConsegnaOrdine( $request );
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
			\DB::table('item_preventivi')->whereIn('id_preventivo',$request->input('ids'))->delete();
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
		$task = $request->input('action_task');
		// Make Sure users Logged 
		if(!\Auth::check()) 
			return redirect('user/login')->with('status', 'error')->with('message','You are not login');

		$this->access = $this->model->validAccess($this->info['id'] , session('gid'));
		$ids = (array) $request->input('ids');
		if(count($ids) >=1)
		{
		    $oldState = \DB::table('preventivi')->where('id',$ids[0]) ->first();
		    
		  
		    $idState = \DB::table('stato_check')->select('id') ->where([['stato_partenza', '=', $oldState->stato],['stato_arrivo', '=', $newState],])->first();
		    

		    if (count((array)$idState)>=1) {
			    $updateData = $this->mergeStateNote($request, ['stato' => $newState]);
			    \DB::table('preventivi')->whereIn('id',$ids)->update($updateData);
			    \SiteHelpers::auditTrail( $request , "ID : ".implode(",",$ids)."  , Lo stato è cambiato in " . $newState);
			    // redirect
        	    if ($newState == 'IN LAVORAZIONE' || $newState =='IN LAVORAZIONE SENZA AUTORIZZAZIONE')
        	    {
                    $idPreventivo = $ids;
                    if(!\Auth::check()) 
                        return redirect('user/login')->with('status', 'error')->with('message','You are not login');
                    $idCliente = \DB::table('preventivi')->where('id',$idPreventivo[0])->value('id_cliente');
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
	
	public static function display(  )
	{
		$mode  = isset($_GET['view']) ? 'view' : 'default' ;
		$model  = new Preventivi();
		$info = $model::makeInfo('preventivi');
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
				return view('preventivi.public.view',$data);			
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
			return view('preventivi.public.index',$data);	
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
	
	public function inserisciNonConformita( $request)
	{
	    $idPreventivo = $request->input('id_preventivo');
	    if(!\Auth::check()) 
			return redirect('user/login')->with('status', 'error')->with('message','You are not login');
		$id = \DB::table('non_conforme')->insertGetId(['id_preventivo' => $idPreventivo]);
        return $id;
	}
	
	//------------------------------------------------------------


public function AutorizzaOrdine( $request)
	{
		$newState = $request->input('state');
		$task = $request->input('action_task');
		// Make Sure users Logged 
		if(!\Auth::check()) 
			return redirect('user/login')->with('status', 'error')->with('message','You are not login');

		$this->access = $this->model->validAccess($this->info['id'] , session('gid'));
		$ids = (array) $request->input('ids');
		if(count($ids) >=1)
		{
		    $oldState = \DB::table('preventivi')->where('id',$ids[0]) ->first();
		    $autorizzazione = $request->input('nOrdine');
		    $dataOdierna  = $request->input('dataAutorizzazioneOdierna');
		    //costruzione data ODIERNA
		    $time = strtotime($dataOdierna);

            $newformatOD = date('Y-m-d',$time);
		    //fine costruzione data ODIERNA
		    $data = $request->input('dataAutorizzazione');
		    $cambiadata = $request->input('cambiadata');
		    //costruzione data
		    $time = strtotime($data);

            $newformat = date('Y-m-d',$time);
		    //fine costruzione data
		    $idState = \DB::table('stato_check')->select('id') ->where([['stato_partenza', '=', $oldState->stato],['stato_arrivo', '=', $newState],])->first();
		    
		    if (count((array)$idState)>=1) {
			    $updateData = [
			    	'stato' => $newState,
			    	'numero_autorizzazione' => $autorizzazione,
			    	'data_ricezione_autorizzazione' => $newformatOD
			    ];
			  if($cambiadata=="si"){
			     $updateData['data_accettazione'] = $newformat;
			  }
			  $updateData = $this->mergeStateNote($request, $updateData);
			    \DB::table('preventivi')->whereIn('id',$ids)->update($updateData);
			    \SiteHelpers::auditTrail( $request , "ID : ".implode(",",$ids)."  , Lo stato è cambiato in " . $newState);
			    // redirect
        	    if ($newState == 'IN LAVORAZIONE' || $newState =='IN LAVORAZIONE SENZA AUTORIZZAZIONE')
        	    {
                    $idPreventivo = $ids;
                    if(!\Auth::check()) 
                        return redirect('user/login')->with('status', 'error')->with('message','You are not login');
                    $idCliente = \DB::table('preventivi')->where('id',$idPreventivo[0])->value('id_cliente');
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
	
	
	
	//-------------------------------------Fattura---------------------------------------
	
	
	public function FatturaOrdine( $request)
	{
		$newState = $request->input('state');
		$task = $request->input('action_task');
		// Make Sure users Logged 
		if(!\Auth::check()) 
			return redirect('user/login')->with('status', 'error')->with('message','You are not login');

		$this->access = $this->model->validAccess($this->info['id'] , session('gid'));
		$ids = (array) $request->input('ids');
		if(count($ids) >=1)
		{
		    $oldState = \DB::table('preventivi')->where('id',$ids[0]) ->first();
		    $numeroFattura = $request->input('nFattura');
		   
		    $idState = \DB::table('stato_check')->select('id') ->where([['stato_partenza', '=', $oldState->stato],['stato_arrivo', '=', $newState],])->first();
				     
		    if (count((array)$idState)>=1) {
				$updateData = $this->mergeStateNote($request, [
					'stato' => $newState,
					'numero_fattura' => $numeroFattura
				]);
				\DB::table('preventivi')->whereIn('id',$ids)->update($updateData);
				    \SiteHelpers::auditTrail( $request , "ID : ".implode(",",$ids)."  , Lo stato è cambiato in " . $newState);
				    // redirect
        	    if ($newState == 'IN LAVORAZIONE' || $newState =='IN LAVORAZIONE SENZA AUTORIZZAZIONE')
        	    {
                    $idPreventivo = $ids;
                    if(!\Auth::check()) 
                        return redirect('user/login')->with('status', 'error')->with('message','You are not login');
                    $idCliente = \DB::table('preventivi')->where('id',$idPreventivo[0])->value('id_cliente');
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
	
	
	
		//-------------------------------------Consegna---------------------------------------

public function ConsegnaOrdine($request)
	{
	  
		$newState = $request->input('state');
		$task = $request->input('action_task');
		// Make Sure users Logged 
		if(!\Auth::check()) 
		return redirect('user/login')->with('status', 'error')->with('message','You are not login');




		$this->access = $this->model->validAccess($this->info['id'] , session('gid'));
		$ids = (array) $request->input('ids');
		if(count($ids) >=1)
		{
		    $oldState = \DB::table('preventivi')->where('id',$ids[0]) ->first();
		     // $idState = \DB::table('stato_check')->select('id') ->where([['stato_partenza', '=', $oldState->stato],['stato_arrivo', '=', $newState],])->first();
		    
		    
		    
		    
			    
				    
			    $updateData = $this->mergeStateNote($request, ['stato' => $newState]);
			    \DB::table('preventivi')->whereIn('id',$ids)->update($updateData);
			     \DB::table('lavorazioni')->whereIn('id_preventivo',$ids)->update(['stato' => 'LAVORATO']);
		      $idPreventivo = $ids;
		      
		      
		      //abbiamo id preventivo, prendiamo id item preventivi, da quelli risaliamo ad id item lavorazioni e mandiamo in upgrade quegli items 
		      
		         // on declare $mysqli apres !
                 $mysqli = new mysqli('localhost', 'wqortody_user', 'TauvByodceow9Graym' );
                 // cnx a la base
                 mysqli_select_db($mysqli, 'wqortody_sximo') or die('Errore connessione al DB: ' .mysqli_connect_error());
                  
                
		         $sql="Select item_preventivi.id from item_preventivi where id_preventivo = $idPreventivo";


                 $result = mysqli_query($mysqli, $sql)  or die ('Errore SQL : ' .$sql .mysqli_connect_error() );
                 
                 while($row=$result->fetch_array()){
                     $sql2="Select id from item_lavorazioni where id_item_preventivi = $row[id]";
                     $result2 = mysqli_query($mysqli, $sql)  or die ('Errore SQL : ' .$sql .mysqli_connect_error() );
                     while($row2=$result->fetch_array()){
                     $sql3="UPDATE item_lavorazioni SET stato = 'CONSEGNATO' where id = $row[id] ";
                     }
                 }
                 
		         
		        
		      
		      
		      
		      
		      
			 //---------
			    \SiteHelpers::auditTrail( $request , "ID : ".implode(",",$request->input('ids'))."  , Lo stato è cambiato in " . $newState);
			    // redirect
        	    if ($newState == '!!!!')
        	    {
                    $idPreventivo = $request->input('ids');
                    if(!\Auth::check()) 
                    return redirect('user/login')->with('status', 'error')->with('message','You are not login');
                    $idCliente = \DB::table('preventivi')->where('id',$request->input('ids'))->value('id_cliente');
                    $curTime = new \DateTime();
                    $created_at = $curTime->format("Y-m-d");
                    $id = \DB::table('lavorazioni')->insertGetId(['id_preventivo' => (int)$request->input('ids'),'id_cliente' => $idCliente,'stato' => 'IN LAVORAZIONE','data_creazione_lavorazione' => $created_at]);
                    $items = \DB::table('item_preventivi')->where('id_preventivo', $idPreventivo[0])->get();
                    
                    foreach ($items as $item ) {
                       $codiceNomenclatore = \DB::table('nomenclatore')->where('id',$item->codice_nomenclatore)->value('codice');
                       $descrizioneNomenclatore = \DB::table('nomenclatore')->where('id',$item->codice_nomenclatore)->value('descrizione');
                       $idItem = \DB::table('item_lavorazioni')->where(['id_item_preventivi' => $item->id,'data_creazione_lavorazione' => $created_at,'importo' => $item->importo,'descrizione_nomenclatore' => $descrizioneNomenclatore,'codice_nomenclatore' => $codiceNomenclatore,'quantita'=>$item->quantita,'id_lavorazione' => $id,'stato'=>'IN LAVORAZIONE'])->value('id');
                       \DB::table('item_lavorazioni')->where('id', '=', $idItem)->update(['stato' => 'CONSEGNATO']);
                        
                    }
                    
                    return $id; 
        	    } else
        	    {
        	      return ['message'=>__('STATO PREVENTIVO AGGIORNATO'),'status'=>'success'];   
        	    }

		    } else {
		        return ['message'=>__('NON è POSSIBILE AGGIORNARE LO STATO'),'status'=>'error'];
		    }
	
		}

	


//--------------------------------------------------BOZZA-------------------------------------------

		public function Bozza( $request)
	{
		$newState = $request->input('state');
		$task = $request->input('action_task');
		// Make Sure users Logged 
		if(!\Auth::check()) 
			return redirect('user/login')->with('status', 'error')->with('message','You are not login');

		$this->access = $this->model->validAccess($this->info['id'] , session('gid'));
		$ids = (array) $request->input('ids');
		if(count($ids) >=1)
		{
		    $oldState = \DB::table('preventivi')->where('id',$ids[0]) ->first();
		   
		    $idState = \DB::table('stato_check')->select('id') ->where([['stato_partenza', '=', $oldState->stato],['stato_arrivo', '=', $newState],])->first();
		    $updateData = $this->mergeStateNote($request, ['stato' => $newState]);
		    \DB::table('preventivi')->whereIn('id',$ids)->update($updateData);
		    if (count($idState)>=1) {
			    
			  
			 
			    \SiteHelpers::auditTrail( $request , "ID : ".implode(",",$ids)."  , Lo stato è cambiato in " . $newState);
			    // redirect
        	    if ($newState == 'IN LAVORAZIONE' || $newState =='IN LAVORAZIONE SENZA AUTORIZZAZIONE')
        	    {
                    $idPreventivo = $ids;
                    if(!\Auth::check()) 
                        return redirect('user/login')->with('status', 'error')->with('message','You are not login');
                    $idCliente = \DB::table('preventivi')->where('id',$idPreventivo[0])->value('id_cliente');
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
	
	protected function updatePrivateNote( $request)
	{
		if(!\Auth::check()) 
			return redirect('user/login')->with('status', 'error')->with('message','You are not login');

		$id = (int) $request->input('note_record_id');
		if($id <= 0){
			return ['message'=>__('core.note_error'),'status'=>'error'];
		}

		$note = $request->input('note_value', '');
		\DB::table('preventivi')->where('id',$id)->update(['note_private' => $note]);
		\SiteHelpers::auditTrail( $request , "ID : ".$id."  , Nota privata aggiornata");

		return ['message'=>'Nota privata aggiornata','status'=>'success'];
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

	protected function mergeStateNote($request, array $data)
	{
		if($request->exists('state_note')){
			$data['note_private'] = $request->input('state_note');
		}
		return $data;
	}
}

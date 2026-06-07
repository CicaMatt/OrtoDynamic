<?php namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Model;

class inlavorazione extends Sximo  {
	
	protected $table = 'lavorazioni';
	protected $primaryKey = 'id';

	public function __construct() {
		parent::__construct();
		
	}

	public static function querySelect(  ){
		
		return "  SELECT lavorazioni.*,preventivi.id as idprev2, preventivi.prescizione_dettagliata_protesi 
 FROM lavorazioni
 INNER JOIN preventivi ON (lavorazioni.id_preventivo=preventivi.id) ";
	}	

	public static function queryWhere(  ){
		
		return "  WHERE lavorazioni.id IS NOT NULL
AND lavorazioni.stato = 'IN LAVORAZIONE' ";
	}
	
	public static function queryGroup(){
		return "  ";
	}
	

}

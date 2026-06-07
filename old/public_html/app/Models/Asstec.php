<?php namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Model;

class asstec extends Sximo  {
	
	protected $table = 'lavorazioni';
	protected $primaryKey = 'id';

	public function __construct() {
		parent::__construct();
		
	}

	public static function querySelect(  ){
		
		return "  SELECT lavorazioni.*,preventivi.id as idprev2
 FROM lavorazioni
 LEFT JOIN preventivi ON (lavorazioni.id_preventivo=preventivi.id)  ";
	}	

	public static function queryWhere(  ){
		
		return "  WHERE lavorazioni.id IS NOT NULL and assistenza_tecnica='SI'";
	}
	
	public static function queryGroup(){
		return "  ";
	}
	

}

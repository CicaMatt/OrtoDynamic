<?php namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Model;

class preventivi extends Sximo  {
	
	protected $table = 'preventivi';
	protected $primaryKey = 'id';

	public function __construct() {
		parent::__construct();
		
	}

	public static function querySelect(  ){
		
		//return "   SELECT preventivi.*,lavorazioni.stato as stato_1 FROM preventivi LEFT JOIN lavorazioni ON preventivi.id=lavorazioni.id_preventivo  ";
		return "   SELECT preventivi.*,lavorazioni.stato as stato_1,clienti.citta FROM preventivi LEFT JOIN lavorazioni ON (lavorazioni.id_preventivo=preventivi.id) LEFT JOIN clienti ON (clienti.id = preventivi.id_cliente)";
	}	

	public static function queryWhere(  ){
		
		return "  WHERE preventivi.id IS NOT NULL ";
	}
	
	public static function queryGroup(){
		return "  ";
	}
	

}

<?php namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Model;

class prevlav extends Sximo  {
	
	protected $table = 'preventivi';
	protected $primaryKey = 'id';

	public function __construct() {
		parent::__construct();
		
	}

	public static function querySelect(  ){
		
		return "  SELECT preventivi.*, lavorazioni.stato as StatoLavorazione FROM preventivi LEFT JOIN lavorazioni ON (lavorazioni.id_preventivo=preventivi.id) "; 
	}	

	public static function queryWhere(  ){
		
		return "  WHERE preventivi.id IS NOT NULL and preventivi.stato='IN LAVORAZIONE' ";
	}
	
	public static function queryGroup(){
		return "  ";
	}
	

}

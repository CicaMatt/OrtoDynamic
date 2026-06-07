<?php namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Model;

class daconsegnare extends Sximo  {
	
	protected $table = 'lavorazioni';
	protected $primaryKey = 'id';

	public function __construct() {
		parent::__construct();
		
	}

	public static function querySelect(  ){
		
		return "  SELECT lavorazioni.* FROM lavorazioni  ";
	}	

	public static function queryWhere(  ){
		
		return "   WHERE lavorazioni.id IS NOT NULL and stato = 'DA CONSEGNARE' ";
	}
	
	public static function queryGroup(){
		return "  ";
	}
	

}

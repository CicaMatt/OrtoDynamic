<?php namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Model;

class statilavorazioni extends Sximo  {
	
	protected $table = 'stato_lavorazioni';
	protected $primaryKey = 'id';

	public function __construct() {
		parent::__construct();
		
	}

	public static function querySelect(  ){
		
		return "  SELECT stato_lavorazioni.* FROM stato_lavorazioni  ";
	}	

	public static function queryWhere(  ){
		
		return "  WHERE stato_lavorazioni.id IS NOT NULL ";
	}
	
	public static function queryGroup(){
		return "  ";
	}
	

}

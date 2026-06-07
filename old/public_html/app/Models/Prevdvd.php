<?php namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Model;

class prevdvd extends Sximo  {
	
	protected $table = 'preventivi';
	protected $primaryKey = 'id';

	public function __construct() {
		parent::__construct();
		
	}

	public static function querySelect(  ){
		
		return "  SELECT preventivi.* FROM preventivi  ";
	}	

	public static function queryWhere(  ){
		
		return "  WHERE preventivi.id IS NOT NULL and ( data_creazione > '2021-12-31' and data_creazione<='2022-12-31' )  ";
	}
	
	public static function queryGroup(){
		return "  ";
	}
	

}

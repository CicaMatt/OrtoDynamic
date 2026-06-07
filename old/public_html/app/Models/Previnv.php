<?php namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Model;

class previnv extends Sximo  {
	
	protected $table = 'preventivi';
	protected $primaryKey = 'id';

	public function __construct() {
		parent::__construct();
		
	}

	public static function querySelect(  ){
		
		return "  SELECT preventivi.* FROM preventivi  ";
	}	

	public static function queryWhere(  ){
		
		return " WHERE stato='INVIATO'
       AND preventivi.id IS NOT NULL ";
	}
	
	public static function queryGroup(){
		return "  ";
	}
	

}

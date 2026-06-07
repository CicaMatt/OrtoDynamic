<?php namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Model;

class prinvp extends Sximo  {
	
	protected $table = 'preventivi';
	protected $primaryKey = 'id';

	public function __construct() {
		parent::__construct();
		
	}

	public static function querySelect(  ){
		
		return "  SELECT preventivi.* FROM preventivi  ";
	}	

	public static function queryWhere(  ){
		
		return "  WHERE preventivi.id IS NOT NULL and stato='INVIATO' ";
	}
	
	public static function queryGroup(){
		return "  ";
	}
	

}

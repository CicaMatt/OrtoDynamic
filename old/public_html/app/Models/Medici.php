<?php namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Model;

class medici extends Sximo  {
	
	protected $table = 'medici';
	protected $primaryKey = 'id';

	public function __construct() {
		parent::__construct();
		
	}

	public static function querySelect(  ){
		
		return "  SELECT medici.* FROM medici  ";
	}	

	public static function queryWhere(  ){
		
		return "  WHERE medici.id IS NOT NULL ";
	}
	
	public static function queryGroup(){
		return "  ";
	}
	

}

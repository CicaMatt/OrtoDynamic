<?php namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Model;

class piede extends Sximo  {
	
	protected $table = 'clienti';
	protected $primaryKey = 'id';

	public function __construct() {
		parent::__construct();
		
	}

	public static function querySelect(  ){
		
		return "  SELECT clienti.* FROM clienti  ";
	}	

	public static function queryWhere(  ){
		
		return "  WHERE clienti.id IS NOT NULL ";
	}
	
	public static function queryGroup(){
		return "  ";
	}
	

}

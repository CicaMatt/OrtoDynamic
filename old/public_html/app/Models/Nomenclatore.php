<?php namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Model;

class nomenclatore extends Sximo  {
	
	protected $table = 'nomenclatore';
	protected $primaryKey = 'id';

	public function __construct() {
		parent::__construct();
		
	}

	public static function querySelect(  ){
		
		return "  SELECT nomenclatore.* FROM nomenclatore  ";
	}	

	public static function queryWhere(  ){
		
		return "  WHERE nomenclatore.id IS NOT NULL ";
	}
	
	public static function queryGroup(){
		return "  ";
	}
	

}

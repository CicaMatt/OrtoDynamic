<?php namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Model;

class statocheck extends Sximo  {
	
	protected $table = 'stato_check';
	protected $primaryKey = 'id';

	public function __construct() {
		parent::__construct();
		
	}

	public static function querySelect(  ){
		
		return "  SELECT stato_check.* FROM stato_check  ";
	}	

	public static function queryWhere(  ){
		
		return "  WHERE stato_check.id IS NOT NULL ";
	}
	
	public static function queryGroup(){
		return "  ";
	}
	

}

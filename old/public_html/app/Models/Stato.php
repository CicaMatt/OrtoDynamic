<?php namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Model;

class stato extends Sximo  {
	
	protected $table = 'stato';
	protected $primaryKey = 'id';

	public function __construct() {
		parent::__construct();
		
	}

	public static function querySelect(  ){
		
		return "  SELECT stato.* FROM stato  ";
	}	

	public static function queryWhere(  ){
		
		return "  WHERE stato.id IS NOT NULL ";
	}
	
	public static function queryGroup(){
		return "  ";
	}
	

}

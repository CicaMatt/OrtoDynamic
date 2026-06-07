<?php namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Model;

class formc extends Sximo  {
	
	protected $table = 'controlli_periodici';
	protected $primaryKey = 'id';

	public function __construct() {
		parent::__construct();
		
	}

	public static function querySelect(  ){
		
		return "  SELECT controlli_periodici.* FROM controlli_periodici  ";
	}	

	public static function queryWhere(  ){
		
		return "  WHERE controlli_periodici.id IS NOT NULL ";
	}
	
	public static function queryGroup(){
		return "  ";
	}
	

}

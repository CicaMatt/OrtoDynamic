<?php namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Model;

class aziende extends Sximo  {
	
	protected $table = 'aziende_sanitarie';
	protected $primaryKey = 'id';

	public function __construct() {
		parent::__construct();
		
	}

	public static function querySelect(  ){
		
		return "  SELECT aziende_sanitarie.* FROM aziende_sanitarie  ";
	}	

	public static function queryWhere(  ){
		
		return "  WHERE aziende_sanitarie.id IS NOT NULL ";
	}
	
	public static function queryGroup(){
		return "  ";
	}
	

}

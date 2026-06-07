<?php namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Model;

class misuregenerali extends Sximo  {
	
	protected $table = 'clienti';
	protected $primaryKey = 'id';

	public function __construct() {
		parent::__construct();
		
	}

	public static function querySelect(  ){
		
		return "  SELECT clienti.id,mis_collo,mis_omero,mis_braccio,mis_polso,mis_bacino,mis_coscia,mis_gamba,altro FROM clienti  ";
	}	

	public static function queryWhere(  ){
		
		return "  WHERE clienti.id IS NOT NULL ";
	}
	
	public static function queryGroup(){
		return "  ";
	}
	

}

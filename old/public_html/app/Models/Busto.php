<?php namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Model;

class busto extends Sximo  {
	
	protected $table = 'clienti';
	protected $primaryKey = 'id';

	public function __construct() {
		parent::__construct();
		
	}

	public static function querySelect(  ){
		
		return "  SELECT clienti.id,misura_vita,misura_bacino,misura_2_4,fino_ascella,spallacci,alt_stoffa_ant,alt_tot_armatura,dist_ascellare FROM clienti  ";
	}	

	public static function queryWhere(  ){
		
		return "  WHERE clienti.id IS NOT NULL ";
	}
	
	public static function queryGroup(){
		return "  ";
	}
	

}

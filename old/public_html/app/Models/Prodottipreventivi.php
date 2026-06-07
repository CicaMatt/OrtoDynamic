<?php namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Model;

class prodottipreventivi extends Sximo  {
	
	protected $table = 'item_preventivi';
	protected $primaryKey = 'id';

	public function __construct() {
		parent::__construct();
		
	}

	public static function querySelect(  ){
		
		return "  SELECT item_preventivi.* FROM item_preventivi  ";
	}	

	public static function queryWhere(  ){
		
		return "  WHERE item_preventivi.id IS NOT NULL ";
	}
	
	public static function queryGroup(){
		return "  ";
	}
	

}

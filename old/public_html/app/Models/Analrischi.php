<?php namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Model;

class analrischi extends Sximo  {
	
	protected $table = 'analisi_rischi';
	protected $primaryKey = 'id';

	public function __construct() {
		parent::__construct();
		
	}

	public static function querySelect(  ){
		
		return "  SELECT analisi_rischi.* FROM analisi_rischi  ";
	}	

	public static function queryWhere(  ){
		
		return "  WHERE analisi_rischi.id IS NOT NULL ";
	}
	
	public static function queryGroup(){
		return "  ";
	}
	

}

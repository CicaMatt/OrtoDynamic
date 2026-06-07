<?php namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Model;

class prodint extends Sximo  {
	
	protected $table = 'item_lavorazioni';
	protected $primaryKey = 'id';

	public function __construct() {
		parent::__construct();
		
	}

	public static function querySelect(  ){
		
		return "     SELECT item_lavorazioni.*,lavorazioni.id_cliente as cliente, lavorazioni.id_preventivo as preventivo, lavorazioni.id_preventivo as preventivo2
 FROM item_lavorazioni
 LEFT JOIN lavorazioni ON (lavorazioni.id=item_lavorazioni.id_lavorazione)
";
	}	

	public static function queryWhere(  ){
		
		return "  WHERE item_lavorazioni.id IS NOT NULL and item_lavorazioni.produzione is not null";
	}
	
	public static function queryGroup(){
		return "  ";
	}
	

}

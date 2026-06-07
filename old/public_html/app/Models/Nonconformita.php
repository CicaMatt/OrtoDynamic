<?php namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Model;

class nonconformita extends Sximo  {
	
	protected $table = 'non_conforme';
	protected $primaryKey = 'id';

	public function __construct() {
		parent::__construct();
		
	}

	public static function querySelect(  ){
		
		return "   SELECT non_conforme.*,clienti.cognome,clienti.nome,clienti.data_nascita 
 FROM non_conforme LEFT JOIN preventivi ON non_conforme.id_preventivo = preventivi.id
 LEFT JOIN clienti ON preventivi.id_cliente = clienti.id ";
	}	

	public static function queryWhere(  ){
		
		return "  WHERE non_conforme.id IS NOT NULL ";
	}
	
	public static function queryGroup(){
		return "  ";
	}
	

}

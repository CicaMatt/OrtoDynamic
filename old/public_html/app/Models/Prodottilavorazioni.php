<?php namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Model;

class prodottilavorazioni extends Sximo  {
	
	protected $table = 'item_lavorazioni';
	protected $primaryKey = 'id';

	public function __construct() {
		parent::__construct();
		
	}

	public static function querySelect(  ){
		
		return " select item_lavorazioni.id,item_lavorazioni.codice_nomenclatore,item_lavorazioni.descrizione_nomenclatore,item_lavorazioni.quantita,item_lavorazioni.importo,
item_lavorazioni.stato,item_lavorazioni.data_creazione_lavorazione,item_lavorazioni.data_annullamento,
item_lavorazioni.data_ordine,item_lavorazioni.data_consegna_parziale,item_lavorazioni.data_consegna, item_lavorazioni.produzione, item_lavorazioni.materiale, item_lavorazioni.fornitore, item_lavorazioni.DDT, item_lavorazioni.lotto
from item_lavorazioni

 ";
	}	

	public static function queryWhere(  ){
		
		return " where item_lavorazioni.id is not null ";
	}
	
	public static function queryGroup(){
		return "  ";
	}
	

}

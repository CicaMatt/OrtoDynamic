<?php



//-------------------------------------------------------------------------
/* Start Users Routes */
// -- Get Method --
Route::resource('core/users','UsersController');
Route::get('core/users/blast','UsersController@getBlast');
// -- Post Method --
Route::post('core/users/doblast','UsersController@postDoblast');
/* End Users Routes */

//-------------------------------------------------------------------------
/* Start Groups Routes */
// -- Get Method --
Route::resource('core/groups','GroupsController');
/* End Groups Routes */

//-------------------------------------------------------------------------
/* Start Pages Routes */
// -- Get Method --
Route::resource('core/pages','PagesController');
/* End Pages Routes */

//-------------------------------------------------------------------------
/* Start Posts Routes */
// -- Get Method --
Route::resource('core/posts','PostsController');
Route::post('core/posts/config','PostsController@postConfig');
/* End Posts Routes */

//-------------------------------------------------------------------------
/* Start Logs Routes */
// -- Get Method --
Route::resource('core/logs','LogsController');
/* End Logs Routes */


//-------------------------------------------------------------------------
/* Start Logs Routes */
// -- Get Method --
Route::resource('core/forms','FormsController');
/*Route::get('core/forms/configuration/{any?}','FormsController@getConfiguration');
Route::get('core/forms/input/{any?}','FormsController@getInput');
Route::get('core/forms/field/{any?}','FormsController@getField');
Route::get('core/forms/removefield/{id?}/{id2?}','FormsController@getRemovefield');
Route::get('core/forms/rebuild/{id?}','FormsController@getRebuild');
Route::get('core/forms/docs','FormsController@getDocs');

// -- Post Method --
Route::post('core/forms/save','FormsController@postSave');
Route::post('core/forms/field/{any?}','FormsController@postField');
Route::post('core/forms/reorder/{any?}','FormsController@postReorder');
/* End  Tables Routes */



//-------------------------------------------------------------------------
/* Start Elfinder Routes */
// -- Get Method --
Route::get('core/elfinder','ElfinderController@getIndex');
/* End  Elfinder Routes */


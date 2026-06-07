<?php namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\User;
use App\Libary\SiteHelpers;
use Socialize;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator as Paginator;
use Validator, Input, Redirect ; 

class UserController extends Controller {

	
	protected $layout = "layouts.main";

	public function __construct() {
		parent::__construct();
		$this->data = array();

	} 

	public function getRegister() {
        
		if($this->config['cnf_regist'] =='false') :    
			if(\Auth::check()):
				 return Redirect::to('')->with('message',\SiteHelpers::alert('success','Youre already login'));
			else:
				 return Redirect::to('user/login');
			  endif;
			  
		else :
				$this->data['socialize'] =  config('services');
				return view('user.register', $this->data);  
		 endif ; 
           
	

	}

	public function postCreate( Request $request) {
	
		$rules = array(
			'username'=>'required|alpha|between:3,12|unique:tb_users',
			'firstname'=>'required|alpha_num|min:2',
			'lastname'=>'required|alpha_num|min:2',
			'email'=>'required|email|unique:tb_users',
			'password'=>'required|between:6,12|confirmed',
			'password_confirmation'=>'required|between:6,12'
			);	
		if($this->config['cnf_recaptcha'] =='true') $rules['recaptcha_response_field'] = 'required|recaptcha';
				
		$validator = Validator::make($request->all(), $rules);

		if ($validator->passes()) {
			$code = rand(10000,10000000);
			
			$authen = new User;
			$authen->username = $request->input('username');
			$authen->first_name = $request->input('firstname');
			$authen->last_name = $request->input('lastname');
			$authen->email = trim($request->input('email'));
			$authen->activation = $code;
			$authen->group_id = $this->config['cnf_group'];
			$authen->password = \Hash::make($request->input('password'));
			if($this->config['cnf_activation'] == 'auto') { $authen->active = '1'; } else { $authen->active = '0'; }
			$authen->save();
			
			$data = array(
				'firstname'	=> $request->input('firstname') ,
				'lastname'	=> $request->input('lastname') ,
				'email'		=> $request->input('email') ,
				'password'	=> $request->input('password') ,
				'code'		=> $code ,
				'subject'	=> "[ " .$this->config['cnf_appname']." ] REGISTRATION "
				
			);
			if($this->config['cnf_activation'] == 'confirmation')
			{ 

				$to = $request->input('email');
				$subject = "[ " .$this->config['cnf_appname']." ] REGISTRATION "; 

			
				if($this->config['cnf_mail'] =='swift')
				{ 
					\Mail::send('user.emails.registration', $data, function ($message) use ($data) {
			    		$message->to($data['email'])->subject($data['subject']);
			    	});	

				}  else {
		
					$message = view('user.emails.registration', $data);
					$headers  = 'MIME-Version: 1.0' . "\r\n";
					$headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
					$headers .= 'From: '.$this->config['cnf_appname'].' <'.$this->config['cnf_email'].'>' . "\r\n";
						mail($to, $subject, $message, $headers);	
				}

				$message = "Thanks for registering! . Please check your inbox and follow activation link";
								
			} elseif($this->config['cnf_activation']=='manual') {
				$message = "Thanks for registering! . We will validate you account before your account active";
			} else {
   			 	$message = "Thanks for registering! . Your account is active now ";         
			
			}	


			return Redirect::to('user/login')->with('message',\SiteHelpers::alert('success',$message));
		} else {
			return Redirect::to('user/register')->with('message',\SiteHelpers::alert('error','The following errors occurred')
			)->withErrors($validator)->withInput();
		}
	}
	
	public function getActivation( Request $request  )
	{
		$num = $request->input('code');
		if($num =='')
			return Redirect::to('user/login')->with('message',\SiteHelpers::alert('error','Invalid Code Activation!'));
		
		$user =  User::where('activation','=',$num)->get();
		if (count($user) >=1)
		{
			\DB::table('tb_users')->where('activation', $num )->update(array('active' => 1,'activation'=>''));
			return Redirect::to('user/login')->with('message',\SiteHelpers::alert('success','Your account is active now!'));
			
		} else {
			return Redirect::to('user/login')->with('message',\SiteHelpers::alert('error','Invalid Code Activation!'));
		}
		
		
	
	}

	public function getLogin() {
	
		if(\Auth::check())
		{
			return Redirect::to('')->with('message',\SiteHelpers::alert('success','Youre already login'));

		} else {
			$this->data['socialize'] =  config('services');
			return View('user.login',$this->data);
			
		}	
	}
	public function reCaptcha( $request)
	{
		if(!is_null($request['g-recaptcha-response']))
        {
            $api_url = 'https://www.google.com/recaptcha/api/siteverify?secret=' . config('sximo.cnf_recaptchaprivatekey') . '&response='.$request['g-recaptcha-response'];
            $response = @file_get_contents($api_url);
            $data = json_decode($response, true);
 
           return $data;
        }
        else
        {
           return false ;
        }		
	}
	public function postSignin( Request $request) {
		
		$rules = array(
			'email'=>'required',
			'password'=>'required',
		);		
		if(config('sximo.cnf_recaptcha') =='true') {
			$return = $this->reCaptcha($request->all());
			if($return !== false)
			{
				if($return['success'] !='true')
				{
					return response()->json(['status' => $return['success'], 'message' =>'Invalid reCpatcha']);	
				}
				
			}
		}
		$validator = Validator::make($request->all(), $rules);
		if ($validator->passes()) {	

			$remember = (!is_null($request->get('remember')) ? 'true' : 'false' );
			
			if (\Auth::attempt(array('email'=>$request->input('email'), 'password'=> $request->input('password') ), $remember )
				or 
				\Auth::attempt(array('username'=>$request->input('email'), 'password'=> $request->input('password') ), $remember )

			) {
				if(\Auth::check())
				{
					$row = User::find(\Auth::user()->id); 	
					if($row->active =='0')
					{
						// inactive 
						if($request->ajax() == true )
						{
							return response()->json(['status' => 'error', 'message' => 'Your Account is not active']);
						} else {
							\Auth::logout();
							return Redirect::to('user/login')->with('message', \SiteHelpers::alert('error','Your Account is not active'));
						}
						
					} else if($row->active=='2')
					{

						if($request->ajax() == true )
						{
							return response()->json(['status' => 'error', 'message' => 'Your Account is BLocked']);
						} else {
							// BLocked users
							\Auth::logout();
							return Redirect::to('user/login')->with('message', \SiteHelpers::alert('error','Your Account is BLocked'));
						}
					} else {
						\DB::table('tb_users')->where('id', '=',$row->id )->update(array('last_login' => date("Y-m-d H:i:s")));
						$session = array(
							'gid' => $row->group_id,
							'uid' => $row->id,
							'eid' => $row->email,
							'll' => $row->last_login,
							'fid' =>  $row->first_name.' '. $row->last_name,
							'username' =>  $row->username ,
							'join'	=>  $row->created_at
						);
						/* Set Lang if available */
						if(!is_null($request->input('language')))
						{
							$session['lang'] = $request->input('language');		
						} else {
							$session['lang'] = $this->config['cnf_lang'];
							
						}


						session($session);
						if($request->ajax() == true )
						{
							if($this->config['cnf_front'] =='false') :
								return response()->json(['status' => 'success', 'url' => url('dashboard')]);					
							else :
								return response()->json(['status' => 'success', 'url' => url('')]);
							endif;	

						} else {
							if($this->config['cnf_front'] =='false') :
								return Redirect::to('dashboard');						
							else :
								return Redirect::to('');
							endif;	

						}

						
											
					}			
					
				}			
				
			} else {

				if($request->ajax() == true )
				{
					return response()->json(['status' => 'error', 'message' => 'Your username/password combination was incorrect']);
				} else {

					return Redirect::to('user/login')
						->with('message', \SiteHelpers::alert('error','Your username/password combination was incorrect'))
						->withInput();					
				}


			}
		} else {

				if($request->ajax() == true)
				{
					return response()->json(['status' => 'error', 'message' => 'The following  errors occurred']);
				} else {

					return Redirect::to('user/login')
						->with('message', \SiteHelpers::alert('error','The following  errors occurred'))
						->withErrors($validator)->withInput();
				}	
		

		}	
	}

	public function getProfile() {
		
		if(!\Auth::check()) return redirect('user/login');
		
		
		$info =	User::find(\Auth::user()->id);
		$this->data = array(
			'pageTitle'	=> 'My Profile',
			'pageNote'	=> 'View Detail My Info',
			'info'		=> $info,
		);
		return view('user.profile',$this->data);
	}
	
	public function postSaveprofile( Request $request)
	{
		if(!\Auth::check()) return Redirect::to('user/login');
		$rules = array(
			'first_name'=>'required|alpha_num|min:2',
			'last_name'=>'required|alpha_num|min:2',
			);	
			
		if($request->input('email') != \Session::get('eid'))
		{
			$rules['email'] = 'required|email|unique:tb_users';
		}	

		if(!is_null($request->file('avatar'))) $rules['avatar'] = 'mimes:jpg,jpeg,png,gif,bmp';

				
		$validator = Validator::make($request->all(), $rules);

		if ($validator->passes()) {
			
			
			if(!is_null($request->file('avatar')))
			{
				$file = $request->file('avatar'); 
				$destinationPath = './uploads/users/';
				$filename = $file->getClientOriginalName();
				$extension = $file->getClientOriginalExtension(); //if you need extension of the file
				$newfilename = \Session::get('uid').'.'.$extension;
				$uploadSuccess = $request->file('avatar')->move($destinationPath, $newfilename);				 
				if( $uploadSuccess ) {
				    $data['avatar'] = $newfilename; 
				}
				$orgFile = $destinationPath.'/'.$newfilename; 
				\SiteHelpers::cropImage('80' , '80' , $orgFile ,  $extension,	 $orgFile)	;
				
			}		
			
			$user = User::find(\Session::get('uid'));
			$user->first_name 	= $request->input('first_name');
			$user->last_name 	= $request->input('last_name');
			$user->email 		= $request->input('email');
			if(isset( $data['avatar']))  $user->avatar  = $newfilename; 			
			$user->save();

			$newUser = User::find(\Session::get('uid'));

			\Session::put('fid',$newUser->first_name.' '.$newUser->last_name);

			return Redirect::to('user/profile')->with('messagetext','Profile has been saved!')->with('msgstatus','success');
		} else {
			return Redirect::to('user/profile')->with('messagetext','The following errors occurred')->with('msgstatus','error')
			->withErrors($validator)->withInput();
		}	
	
	}
	
	public function postSavepassword( Request $request)
	{
		$rules = array(
			'password'=>'required|between:6,12',
			'password_confirmation'=>'required|between:6,12'
			);		
		$validator = Validator::make($request->all(), $rules);
		if ($validator->passes()) {
			$user = User::find(\Session::get('uid'));
			$user->password = \Hash::make($request->input('password'));
			$user->save();

			return Redirect::to('user/profile')->with('message', \SiteHelpers::alert('success','Password has been saved!'));
		} else {
			return Redirect::to('user/profile')->with('message', \SiteHelpers::alert('error','The following errors occurred')
			)->withErrors($validator)->withInput();
		}	
	
	}	
	
	public function getReminder()
	{
	
		return view('user.remind');
	}	

	public function postRequest( Request $request)
	{

		$rules = array(
			'credit_email'=>'required|email'
		);	
		
		$validator = Validator::make($request->all(), $rules);
		if ($validator->passes()) {	
	
			$user =  User::where('email','=',$request->input('credit_email'));
			if($user->count() >=1)
			{
				$user = $user->get();
				$user = $user[0];
				$data = array('token'=>$request->input('_token'));	
				$to = $request->input('credit_email');
				$subject = "[ " .$this->config['cnf_appname']." ] REQUEST PASSWORD RESET "; 
				$data['subject'] =  $subject;	
				$data['email'] = $to;

				if($this->config['cnf_mail'] =='swift')
				{ 
					
					\Mail::send('user.emails.auth.reminder', $data, function ($message) use ($data)  {
			    		$message->to($data['email'])->subject($data['subject']);
			    	});	 

				}  else {

							
					$message = view('user.emails.auth.reminder', $data);
					$headers  = 'MIME-Version: 1.0' . "\r\n";
					$headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
					$headers .= 'From: '.$this->config['cnf_appname'].' <'.$this->config['cnf_email'].'>' . "\r\n";
						mail($to, $subject, $message, $headers);	
				}					
			
				
				$affectedRows = User::where('email', '=',$user->email)
								->update(array('reminder' => $request->input('_token')));
								
				return Redirect::to('user/login')->with('message', \SiteHelpers::alert('success','Please check your email'));	
				
			} else {
				return Redirect::to('user/login?reset')->with('message', \SiteHelpers::alert('error','Cant find email address'));
			}

		}  else {
			return Redirect::to('user/login?reset')->with('message', \SiteHelpers::alert('error','The following errors occurred')
			)->withErrors($validator)->withInput();
		}	 
	}	
	
	public function getReset( $token = '')
	{
		if(\Auth::check()) return Redirect::to('dashboard');

		$user = User::where('reminder','=',$token);;
		if($user->count() >=1)
		{
			$this->data['verCode']= $token;
			return view('user.remind',$this->data);

		} else {
			return Redirect::to('user/login')->with('message', \SiteHelpers::alert('error','Cant find your reset code'));
		}
		
	}	
	
	public function postDoreset( Request $request , $token = '')
	{
		$rules = array(
			'password'=>'required|alpha_num|between:6,12|confirmed',
			'password_confirmation'=>'required|alpha_num|between:6,12'
			);		
		$validator = Validator::make($request->all(), $rules);
		if ($validator->passes()) {
			
			$user =  User::where('reminder','=',$token);
			if($user->count() >=1)
			{
				$data = $user->get();
				$user = User::find($data[0]->id);
				$user->reminder = '';
				$user->password = \Hash::make($request->input('password'));
				$user->save();			
			}

			return Redirect::to('user/login')->with('message',\SiteHelpers::alert('success','Password has been saved!'));
		} else {
			return Redirect::to('user/reset/'.$token)->with('message', \SiteHelpers::alert('error','The following errors occurred')
			)->withErrors($validator)->withInput();
		}	
	
	}	

	public function getLogout() {
		$currentLang = \Session::get('lang');
		\Auth::logout();
		\Session::flush();
		\Session::put('lang', $currentLang);
		return Redirect::to('')->with('message', \SiteHelpers::alert('info','Your are now logged out!'));
	}

	function getSocialize( $social )
	{
		return Socialize::with($social)->redirect();
	}

	function getAutosocial( $social )
	{
		$user = Socialize::with($social)->user();
		$user =  User::where('email',$user->email)->first();
		return self::autoSignin($user);		
	}


	function autoSignin($user)
	{

		if(is_null($user)){
		  return Redirect::to('user/login')
				->with('message', \SiteHelpers::alert('error','You have not registered yet '))
				->withInput();
		} else{

		    Auth::login($user);
			if(Auth::check())
			{
				$row = User::find(\Auth::user()->id); 

				if($row->active =='0')
				{
					// inactive 
					Auth::logout();
					return Redirect::to('user/login')->with('message', \SiteHelpers::alert('error','Your Account is not active'));

				} else if($row->active=='2')
				{
					// BLocked users
					Auth::logout();
					return Redirect::to('user/login')->with('message', \SiteHelpers::alert('error','Your Account is BLocked'));
				} else {
					Session::put('uid', $row->id);
					Session::put('gid', $row->group_id);
					Session::put('eid', $row->group_email);
					Session::put('fid', $row->first_name.' '. $row->last_name);	
					if($this->config['cnf_front'] =='false') :
						return Redirect::to('dashboard');						
					else :
						return Redirect::to('');
					endif;					
					
										
				}
				
				
			}
		}

	}
	
}
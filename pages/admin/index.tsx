import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import React, { useRef } from 'react';
import axios, { isCancel, AxiosError } from 'axios';
import { Capacitor, CapacitorHttp, HttpResponse } from '@capacitor/core';
import { useRouter } from 'next/navigation';
import { NextPage } from 'next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { login_credential, users } from '../../utilities/type';
import { initialLogin } from '../../utilities/defaultData';
import { Field, Form, Formik } from 'formik';
import rfdc from 'rfdc';
import { ClipLoader } from 'react-spinners';

const cloneDeep = rfdc();

const inter = Inter({ subsets: ['latin'] })

// export async function getStaticProps(context: any) {
//   let result;
//   try {
//     result = await excuteQuery({
//       query: 'SELECT * FROM users',
//     });

//     console.log(result);

//   } catch (error) {
//     console.log(error);
//   }
//   return {
//     props: {
//       result: JSON.stringify(result)
//     }, // will be passed to the page component as props
//   }
// }

const Home: NextPage = (result: any) => {
  // let users: any[] = JSON.parse(JSON.stringify(result.result));
  // console.log(users);
  const router = useRouter();
  const [isLogin, setIsLogin] = React.useState(true);
  const [backendValidateMsg, setBackendValidateMsg] = React.useState('');
  const [userObj] = React.useState<login_credential>(initialLogin);

  // React.useEffect(() => {
  //   // let origin = Capacitor.isNative ? publicRuntimeConfig.api_origin : "";
  //   const options = {
  //     url: '/api/hello',
  //     headers: { 'X-Fake-Header': 'Fake-Value' },
  //     params: { size: 'XL' },
  //   };
  //   CapacitorHttp.get(options).then((response: HttpResponse) => {
  //     document.getElementById('axioTest')?.append(JSON.stringify(response.data));
  //   });
  // }, [])

  React.useEffect(() => {
    const options = {
      url: '/api/auth/user',
    };

    CapacitorHttp.get(options).then((response: HttpResponse) => {
      if (response.data.isAuth === true && response.data.user.admin === true) {
        router.push('/admin/users');
      }
    });
  }, [])

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div id="axioTest" className='absolute top-0 right-0'>

        </div>
        <div className="flex min-h-screen">

          {/* Container */}
          <div className="flex flex-row w-full">

            {/*  Sidebar */}
            <div className='hidden lg:flex flex-col justify-between bg-[#ffe85c] lg:p-8 xl:p-12 lg:max-w-sm xl:max-w-lg'>
              <div className="flex items-center justify-start space-x-3">
                <span className="bg-black rounded-full w-8 h-8"></span>
                <a href="#" className="font-medium text-xl">Brand</a>
              </div>
              <div className='space-y-5'>
                <h1 className="lg:text-3xl xl:text-5xl xl:leading-snug font-extrabold">Enter your account and discover new
                  experiences</h1>
                {/* <p className="text-lg">{isLogin ? `You do not have an account?` : `Already have an account?`}</p>
                <button onClick={(event) => { setIsLogin(!isLogin) }}
                  className="inline-block flex-none px-4 py-3 border-2 rounded-lg font-medium border-black bg-black text-white">{isLogin ? `Contact Us` : `Sign In`}</button> */}
              </div>
              <p className="font-medium">© 2023 Education System</p>
            </div>

            {/* LOGIN */}
            <div className="flex flex-1 flex-col items-center justify-center px-10 relative">
              <div className="flex lg:hidden justify-between items-center w-full py-4">
                <div className="flex items-center justify-start space-x-3">
                  <span className="bg-black rounded-full w-6 h-6"></span>
                  <a href="#" className="font-medium text-lg">Brand</a>
                </div>
                {/* <div className="flex items-center space-x-2">
                  <span>Not a member? </span>
                  <button onClick={(event) => { setIsLogin(false) }} className="underline font-medium text-[#070eff]">
                    Sign up now
                  </button>
                </div> */}
              </div>

              <Formik
                initialValues={userObj}
                validate={(user: login_credential) => {
                  setBackendValidateMsg('');
                  const errors: any = {};
                  if (!user.id) {
                    errors.id = 'ID is required'
                  }
                  if (!user.password) {
                    errors.password = 'Password is required'
                  }
                  return errors
                }}
                onSubmit={(user, { setErrors, setSubmitting }) => {
                  const options = {
                    url: `/api/auth/login`,
                    params: {
                      id: user.id || '',
                      password: user.password,
                      admin: 'true'
                    }
                  };

                  setSubmitting(true);

                  CapacitorHttp.post(options).then((response: HttpResponse) => {
                    setSubmitting(false);
                    if (response.data.success !== undefined && response.data.success === false) {
                      if (response.data.message) {
                        setBackendValidateMsg(response.data.message);
                      } else {
                        if (response.data.name) {
                          setErrors({
                            name: response.data.name
                          });
                        } else {
                          setErrors({
                            password: response.data.password
                          });
                        }

                      }

                    } else {
                      router.push('./admin/users');
                    }
                  }).catch(err => {
                    setSubmitting(false);
                  })
                }}
              >
                {({ errors, isSubmitting }) => (
                  <Form className="flex flex-1 flex-col  justify-center space-y-5 max-w-md">
                    <div className="flex flex-col space-y-2 text-center">
                      <h2 className="text-3xl md:text-4xl font-bold">{`Sign in to account (Admin)`}</h2>
                      <p className="text-md md:text-xl">This is login page for admin. If you are not an admin, please go to user login page.</p>
                    </div>
                    <div className="flex flex-col max-w-md space-y-2">
                      <div className="form-control">
                        <Field type="text" placeholder="Admin ID" name="id"
                          className={` ${errors.name ? 'input-error border-red' : 'border-black'} flex px-3 py-2 md:px-4 md:py-3 border-2 rounded-lg font-medium placeholder:font-normal`} />
                        <p className={`text-sm text-red-600 dark:text-red-500 ${errors.name ? 'block' : 'hidden'}`}>{errors.name}</p>
                      </div>
                      <div className="form-control">
                        <Field type="password" placeholder="Password" name="password"
                          className={` ${errors.password ? 'input-error border-red' : 'border-black'} flex px-3 py-2 md:px-4 md:py-3 border-2 rounded-lg font-medium placeholder:font-normal`} />
                        <p className={`text-sm text-red-600 dark:text-red-500 ${errors.password ? 'block' : 'hidden'}`}>{errors.password}</p>
                      </div>
                      <button className={`flex items-center justify-center flex-none px-3 py-2 md:px-4 md:py-3 border-2 rounded-lg font-medium border-black bg-black text-white`}>
                        <ClipLoader
                          color={'white'}
                          loading={isSubmitting}
                          size={20}
                          aria-label="Loading Spinner"
                          data-testid="loader"
                        />Sign in</button>
                      {/* <p className="text-lg text-center lg:hidden block">New user?<button onClick={(event) => setIsLogin(false)} className='pl-2 text-sky-600 cursor-pointer'>Register Now <FontAwesomeIcon icon={faUpRightFromSquare}></FontAwesomeIcon></button></p> */}
                      {/* <p className={`text-sm text-center text-red-600 dark:text-red-500 ${backendValidateMsg ? 'block' : 'hidden'}`}>{backendValidateMsg}</p> */}

                    </div>
                  </Form>
                )}

              </Formik>



            </div>
          </div>

        </div>
      </main>
    </>
  )
}

export default Home;

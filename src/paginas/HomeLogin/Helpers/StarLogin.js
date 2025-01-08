import swal from 'sweetalert2';
import authApi from '../../../api/authApi';

export const starLogin = async (email, password, navigate) => {
  try {
    const resp = await authApi.post('/auth/login', {
      email,
      password
    });
    localStorage.setItem('token', resp.data.token);
    console.log(resp.data)

    if (resp.data.rol === "sup") {
      console.log(resp.data.id)
      navigate('/sup');
    } else {
      navigate("/cobrador_vendedor", );
    }

  } catch (error) {
    console.log(error);
    swal("ERROR", error.response.data.msg, "error");
  }
}
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { show_alerta } from '../functions';

const ShowMovies = () => {
    const url = 'https://662de9aaa7dda1fa378b8b0c.mockapi.io/movies';
    const [movies, setMovies] = useState([]);
    const [id, setId] = useState('');
    const [title, setTitle] = useState('');
    const [year, setYear] = useState('');
    const [duration, setDuration] = useState('');
    const [director, setDirector] = useState('');
    const [operation, setOperation] = useState(1);

    useEffect(() => {
        getMovies();
    }, []);

    const getMovies = async () => {
        const response = await axios.get(url);
        setMovies(response.data);
    }

    const openModal = (op, id, title, year, duration, director) => {
        setId(id);
        setTitle(title);
        setYear(year);
        setDuration(duration);
        setDirector(director);
        setOperation(op);

        if (op === 1) {
            setTitle('Registrar Película');
        } else if (op === 2) {
            setTitle('Editar Película');
        }

        window.setTimeout(function () {
            document.getElementById('titulo').focus();
        }, 500);
    }

    const validate = () => {
        if (title.trim() === '') {
            show_alerta('Escribe el título de la película', 'warning');
        } else if (year === '') {
            show_alerta('Escribe el año de la película', 'warning');
        } else if (duration === '') {
            show_alerta('Escribe la duración de la película', 'warning');
        } else if (director.trim() === '') {
            show_alerta('Escribe el director de la película', 'warning');
        } else {
            const parameters = {
                title: title.trim(),
                year: year,
                duration: duration,
                director: director.trim()
            };

            const method = (operation === 1) ? 'POST' : 'PUT';
            sendRequest(method, parameters);
        }
    }

    const sendRequest = async (method, parameters) => {
        await axios({ method: method, url: (operation === 1) ? url : `${url}/${id}`, data: parameters }).then(function (response) {
            const type = response.data[0];
            const message = response.data[1];
            show_alerta(message, type);
            if (type === 'success') {
                document.getElementById('btnCerrar').click();
                getMovies();
            }
        })
            .catch(function (error) {
                show_alerta('Error en la solicitud', 'error');
                console.log(error);
            });
    }

    const deleteMovie = (id, title) => {
        const MySwal = withReactContent(Swal);
        MySwal.fire({
            title: '¿Seguro de eliminar la película ' + title + ' ?',
            icon: 'question',
            text: 'No se podrá dar marcha atrás',
            showCancelButton: true,
            confirmButtonText: 'Si, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`${url}/${id}`).then(response => {
                    const type = response.data[0];
                    const message = response.data[1];
                    show_alerta(message, type);
                    if (type === 'success') {
                        getMovies();
                    }
                }).catch(error => {
                    show_alerta('Error en la solicitud', 'error');
                    console.log(error);
                });
            } else {
                show_alerta('La película NO fue eliminada', 'info');
            }
        });
    }
    

    return (
        <div className='App'>
            <div className='container-fluid'>
                <div className='row mt-3'>
                    <div className='col-md-4 offset-md-4'>
                        <div className='d-grid mx-auto'>
                            <button onClick={() => openModal(1)} className='btn btn-dark' data-bs-toggle='modal' data-bs-target='#modalMovies'>
                                <i className='fa-solid fa-circle-plus'></i> Añadir
                            </button>
                        </div>
                    </div>
                </div>
                <div className='row mt-3'>
                    <div className='col-12 col-lg-8 offset-0 offset-lg-2'>
                        <div className='table-responsive'>
                            <table className='table table-bordered'>
                                <thead>
                                    <tr><th>#</th><th>TÍ

TULO</th><th>AÑO</th><th>DURACIÓN</th><th>DIRECTOR</th><th></th></tr>
                                </thead>
                                <tbody className='table-group-divider'>
                                    {movies.map((movie, i) => (
                                        <tr key={movie.id}>
                                            <td>{(i + 1)}</td>
                                            <td>{movie.title}</td>
                                            <td>{movie.year}</td>
                                            <td>{movie.duration}</td>
                                            <td>{movie.director}</td>
                                            <td>
                                                <button onClick={() => openModal(2, movie.id, movie.title, movie.year, movie.duration, movie.director)}
                                                    className='btn btn-warning' data-bs-toggle='modal' data-bs-target='#modalMovies'>
                                                    <i className='fa-solid fa-edit'></i>
                                                </button>
                                                &nbsp;
                                                <button onClick={() => deleteMovie(movie.id, movie.title)} className='btn btn-danger'>
                                                    <i className='fa-solid fa-trash'></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div id='modalMovies' className='modal fade' aria-hidden='true'>
                <div className='modal-dialog'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <label className='h5'>{title}</label>
                            <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
                        </div>
                        <div className='modal-body'>
                            <input type='hidden' id='id'></input>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-gift'></i></span>
                                <input type='text' id='titulo' className='form-control' placeholder='Título' value={title}
                                    onChange={(e) => setTitle(e.target.value)}></input>
                            </div>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-calendar'></i></span>
                                <input type='number' id='year' className='form-control' placeholder='Año' value={year}
                                    onChange={(e) => setYear(e.target.value)}></input>
                            </div>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-hourglass'></i></span>
                                <input type='text' id='duration' className='form-control' placeholder='Duración' value={duration}
                                    onChange={(e) => setDuration(e.target.value)}></input>
                            </div>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-user'></i></span>
                                <input type='text' id='director' className='form-control' placeholder='Director' value={director}
                                    onChange={(e) => setDirector(e.target.value)}></input>
                            </div>
                            <div className='d-grid col-6 mx-auto'>
                                <button onClick={() => validate()} className='btn btn-success'>
                                    <i className='fa-solid fa-floppy-disk'></i> Guardar
                                </button>
                            </div>
                        </div>
                        <div className='modal-footer'>
                            <button type='button' id='btnCerrar' className='btn btn-secondary' data-bs-dismiss='modal'>Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ShowMovies;

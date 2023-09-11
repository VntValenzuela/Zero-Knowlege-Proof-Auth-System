## <a name="_toc143013323"></a><a name="_toc144815814"></a>**Manual de Instalación**
**Instalación dependencias**

Primeramente, para la instalación del sistema de autenticación es necesario tener instaladas las siguientes dependencias:

- Node.js 18.16.0 LTS
- Npm 9.6.0
- AUTOMATIC 1111
- Tener Wordpress instalado

Para la instalación de AUTOMATIC 1111 instalarlo desde el repositorio oficial de GitHub <https://github.com/AUTOMATIC1111/stable-diffusion-webui> y seguir las instrucciones de instalación. Descargar el modelo miniSD de Stable Diffusion <https://huggingface.co/justinpinkney/miniSD> para generación de imágenes más rapida.

**Instalación Complemento Wordpress**

El complemento de Wordpress se encuentra en la carpeta *‘zeroauth’*, primeramente, se debe mover esta carpeta al directorio de *plugins* de Wordpress en el caso del sistema operativo Linux se encuentra en: *‘/var/www/html/wordpress/wp-content/plugins/*’.

Una vez que se haya movido la carpeta a este directorio entrar al archivo *.env* y cambiar el valor  de la línea *REACT\_APP\_SERVER\_IP* por la IP que tendrá el  servidor

REACT\_APP\_SERVER\_IP = 'IP del servidor'

Finalmente ejecutar el complemento con el comando:

*npm start*


**Instalación del servidor**

El servidor se encuentra en la carpeta *‘zero-server-auth’*, la instalación del servidor es relativamente sencilla. Se debe primeramente abrir el archivo *.env* y cambiar la variable *DATABASE\_URL* por la  URL de conexión al servidor MongoDB

DATABASE\_URL = ‘mongodb://localhost/mydatabase’



Finalmente ejecutar el servidor con el comando:

*npm run start:server*


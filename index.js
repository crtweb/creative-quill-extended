import '../css/app.scss';
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'

import Quill from 'quill'
import EVideo from './js/quill/Video'
Quill.register(EVideo);

import ETheme from './js/quill/ETheme'
Quill.register({'themes/snow': ETheme}, true);
Quill.import('formats/image').className = 'img-embed'

export default Quill;

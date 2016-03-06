import { remote } from 'electron';

const ENV = remote.process.env.NODE_ENV;

export default ENV;

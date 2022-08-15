import "@testing-library/jest-dom";

// Tell axios to use node adapter while running in testing mode
import axios from 'axios';
axios.defaults.adapter = require('axios/lib/adapters/http');

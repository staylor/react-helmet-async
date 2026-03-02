import React from 'react';

const major = parseInt(React.version.split('.')[0], 10);

export const isReact19 = major >= 19;

import { useState, useEffect } from 'react';
import '../styles/billboard.css';

export default function Billboard({ title, description, image}) {
	return (
	  <div className="billboard">
		<div
		className="image-placeholder"
		style={{ 
			backgroundImage: `url(${image})`,
			backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
		}}	
		></div>
		<div className="content">
		  <h3>{title}</h3>
		  <p>{description}</p>
		</div>
	  </div>
	);
}
  
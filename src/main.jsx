import React from 'react'
import ReactDOM from 'react-dom/client'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'motion/react'
import './index.css'
import './responsive.css'
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { StoreProvider } from './hooks/useGlobalReducer';
import useGlobalReducer from './hooks/useGlobalReducer';
import BlurText from './pages/bits/BlurText.jsx';

const handleAnimationComplete = () => {
	console.log('Animation completed!');
};

const LoadingOverlay = () => {
	const { store } = useGlobalReducer();
	
	return createPortal(
		<AnimatePresence>
			{store.loading && (
				<motion.div
					initial={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.3 }}
					style={{
						position: 'fixed',
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						width: '100vw',
						height: '100vh',
						backgroundColor: 'black',
						zIndex: 9999,
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						overflow: 'hidden'
					}}>
					<BlurText
						text="Welcome to Star Wars"
						delay={130}
						animateBy="words"
						direction="top"
						onAnimationComplete={handleAnimationComplete}
						style={{
							fontSize: '15vw',
							lineHeight: '1.2',
							width: '100%',
							height: '100%'
						}}
						forceAnimate={true}
					/>
				</motion.div>
			)}
		</AnimatePresence>,
		document.getElementById('loading-portal')
	);
};

const AppContent = () => {
	return (
		<>
			<LoadingOverlay />
			<div style={{ position: 'relative', zIndex: 1 }}>
				<RouterProvider router={router} />
			</div>
		</>
	);
}

const Main = () => {
    return (
        <React.StrictMode>
            <StoreProvider>
                <AppContent />
            </StoreProvider>
        </React.StrictMode>
    );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Main />)

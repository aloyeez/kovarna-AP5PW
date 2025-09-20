import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export const useScrollToTop = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    // Check if smooth scrolling is supported
    const supportsSmoothScrolling = 'scrollBehavior' in document.documentElement.style
    
    if (supportsSmoothScrolling) {
      // Smooth scroll to top with animation
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      })
    } else {
      // Fallback for browsers that don't support smooth scrolling
      window.scrollTo(0, 0)
    }
  }, [pathname]) // Trigger whenever the route changes
}

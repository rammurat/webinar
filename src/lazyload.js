const INTERSECTION_OBSERVER_OPTIONS = {
    threshold: 0,
    rootMargin: '0px 0px 75% 0px',
  };
  
  const isLazyLoadNotSupported = !('IntersectionObserver' in window)
      || !('IntersectionObserverEntry' in window)
      || !('intersectionRatio' in window.IntersectionObserverEntry.prototype);
  
  // Update image source from data source to load the image on demand
  function updateImages(element, isLazyLoad, observer) {
    if (element.nodeName.toLowerCase() === 'picture') {
      for (let i = 0; i < element.children.length; i++) {
        if (element.children[i].getAttribute('data-srcset')) {
          element.children[i].setAttribute('srcset', element.children[i].getAttribute('data-srcset'));
        }
      }
    } else {
      if (element.getAttribute('data-src')) {
        element.setAttribute('src', element.getAttribute('data-src'));
      }
  
      if (element.getAttribute('data-srcset')) {
        element.setAttribute('srcset', element.getAttribute('data-srcset'));
      }
      element.setAttribute('data-processed', 'true');
    }
    if (isLazyLoad) {
      observer.unobserve(element);
    }
  }
  
  const loadImg = function (entry, observer) {
    for (let i = 0; i < entry.length; i++) {
      if (entry[i].isIntersecting) {
        updateImages(entry[i].target, true, observer);
      }
    }
  };
  
  const imgObserver = new IntersectionObserver(loadImg, INTERSECTION_OBSERVER_OPTIONS);
  
  // attach lazy load event to elements
  const lazyLoadImages = function ($imgTargets) {
    for (let i = 0; i < $imgTargets.length; i++) {
      imgObserver.observe($imgTargets[i]);
    }
  };
  
  const init = function () {
    const imgTargets = document.querySelectorAll('.lazyLoadTag');
    if (isLazyLoadNotSupported) {
      // update images source directly without lazyload in case browser does not supported
      for (let i = 0; i < imgTargets.length; i++) {
        updateImages(imgTargets[i], false, false);
      }
    } else {
      // apply lazy load to images
      lazyLoadImages(imgTargets);
    }
  };

  init();
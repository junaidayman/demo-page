export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  // setup image columns and text feature lists
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      
      // 1. Existing Logic: Handle Image Columns
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-img-col');
        }
      }

      // 2. New Logic: Author-free Feature Items DOM Structuring
      const children = [...col.children];
      let featuresContainer = null;
      let currentContentWrapper = null;

      children.forEach((el) => {
        const isButton = el.classList.contains('button-wrapper');
        // Check if the element contains an icon (and isn't a button)
        const hasIcon = el.querySelector('.icon') && !isButton;

        if (hasIcon) {
          // Initialize the main container for all features if it doesn't exist yet
          if (!featuresContainer) {
            featuresContainer = document.createElement('div');
            featuresContainer.classList.add('columns-feature-list');
            el.before(featuresContainer); // Insert it exactly where the first icon appeared
          }

          // Create the Sub-Parent Element (Single Feature Item)
          const featureItem = document.createElement('div');
          featureItem.classList.add('columns-feature-item');
          
          // Create the Left Element (Icon Wrapper)
          const iconWrapper = document.createElement('div');
          iconWrapper.classList.add('columns-feature-icon');
          iconWrapper.append(el); // Move the authored <p><span class="icon">...</p> inside
          
          // Create the Right Element (Title & Desc Wrapper)
          currentContentWrapper = document.createElement('div');
          currentContentWrapper.classList.add('columns-feature-content');

          // Assemble the DOM structure
          featureItem.append(iconWrapper, currentContentWrapper);
          featuresContainer.append(featureItem);

        } else if (currentContentWrapper && !isButton) {
          // If we have an active feature item, push subsequent titles/descriptions into the right wrapper
          currentContentWrapper.append(el);
          
          // Optional: Add specific classes to the title and description for easier CSS targeting
          if (el.querySelector('strong') || el.tagName.match(/^H[1-6]$/i)) {
            el.classList.add('columns-feature-title');
          } else {
            el.classList.add('columns-feature-desc');
          }

        } else if (isButton) {
          // Reset state when hitting a button so the button stays outside the feature list
          currentContentWrapper = null;
        }
      });
    });
  });
}
# Button

Everyone loves a button, they're great for all sorts of things, but especially clickin'.

[[toc]]

## Variants

### Default

The standard button.

<ComponentPreview component="_includes/forms/button"  :config="{ label: 'Button' }"/>

### Submit

Submit button

<ComponentPreview component="_includes/forms/button"  :config="{ type: 'submit', class: 'submit', label: 'Submit' }"/>

### Chromeless

<ComponentPreview component="_includes/forms/button"  :config="{ class: 'chromeless', label: 'Chromeless' }"/>

### Loading

<ComponentPreview component="_includes/forms/button"  :config="{ class: 'loading', label: 'Loading', spinner: true }"/>

## Source

### Twig

<<<@/../src/templates/_includes/forms/button.twig

### Javascript

<<<@/../src/web/assets/cp/src/js/UI.js#buttons

export default function polyfillElement(properties) {

  Object.keys(properties).forEach((propertyKey) => {
    const propertyValue = properties[propertyKey];
    Object.defineProperty(window.Element.prototype, propertyKey, {
      get: function() {
        return propertyValue;
      }
    });
  });

}

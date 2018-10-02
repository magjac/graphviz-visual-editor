import XMLSerializer from '@harrison-ifeanyichukwu/xml-serializer';

export default function polyfillXMLSerializer() {
  window.XMLSerializer = XMLSerializer;
}

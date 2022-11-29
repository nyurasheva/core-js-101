/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.height = height;
  this.width = width;
  this.getArea = () => this.height * this.width;
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const jsonsObj = JSON.parse(json);
  return Object.setPrototypeOf(jsonsObj, proto);
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

const cssSelectorBuilder = {
  res: '',
  order: [],
  errorText1: 'Element, id and pseudo-element should not occur more then one time inside the selector',
  errorText2: 'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element',

  stringify() {
    return this.res;
  },

  cssBuilder(num, value) {
    const obj = Object.create(this);
    obj.order = this.order.concat(num);
    this.er1(obj.order);
    this.er2(obj.order);
    obj.res = this.res + value;
    return obj;
  },

  er1(order) {
    const index = order.filter((e) => (e < 2) || (e > 4))
      .findIndex((e, i, a) => a.indexOf(e) !== i);
    if (index >= 0) throw new Error(this.errorText1);
  },

  er2(order) {
    const copy = Array(order.length).fill().map((_, i) => order[i]);
    copy.sort((a, b) => a - b);
    if (!(copy.every((e, i) => e === order[i]))) throw new Error(this.errorText2);
  },

  element(value) {
    return this.cssBuilder(0, value);
  },

  id(value) {
    return this.cssBuilder(1, `#${value}`);
  },

  class(value) {
    return this.cssBuilder(2, `.${value}`);
  },

  attr(value) {
    return this.cssBuilder(3, `[${value}]`);
  },

  pseudoClass(value) {
    return this.cssBuilder(4, `:${value}`);
  },

  pseudoElement(value) {
    return this.cssBuilder(5, `::${value}`);
  },

  combine(selector1, combinator, selector2) {
    const obj = Object.create(this);
    obj.res = `${selector1.res} ${combinator} ${selector2.res}`;
    return obj;
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};

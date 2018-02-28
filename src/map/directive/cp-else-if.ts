import _ from 'lodash';
import { MapDom } from '../map-dom';
import { Common } from '../../common';
import { Constants } from '../../constants';
import { CPIf } from "./cp-if";

export class CPElseIf {

    private element: any;
    private map: MapDom;
    private elementComment;
    private prevElement;
    private attribute;
    private cpIf;
    private cpElseIf;

    constructor(_element: HTMLElement, _map: MapDom) {
        Common.getScope(_element).$on('$onInit', () => {
            this.element = _element;
            this.element['cpElseIf'] = this;
            this.integrationCpElse();
            this.attribute = Common.getAttributeCpElseIf(this.element);
            this.prevElement = _element.previousSibling;
            this.cpIf = Common.getScope(this.element).parentCondition;
            if (!this.cpIf) {
                throw "cp-else-if expected cp-if or cp-else-if above.";
            }
            this.map = _map;
            this.elementComment = document.createComment('CPElseIf '+this.attribute);
            this.init();
        });
    }

    integrationCpElse(){
        let nextElement = this.element.nextElementSibling;
        if(nextElement && (nextElement.hasAttribute(Constants.ELSE_ATTRIBUTE_NAME) || nextElement.hasAttribute(Constants.ELSE_IF_ATTRIBUTE_NAME)) ){
            Common.getScope(nextElement).parentCondition = this;
        }
    }

    init() {
        if (!this.element) {
            return;
        }
        try {
            if(!Common.isValidCondition(this.cpIf.element, Common.getAttributeCpIf(this.cpIf.element))){
                Common.createElement(this.element, this.elementComment)
                if(!Common.isValidCondition(this.element, this.attribute))
                    Common.destroyElement(this.element, this.elementComment);
            }else{
                Common.destroyElement(this.element, this.elementComment);
            }
        } catch (ex) {
            Common.destroyElement(this.element, this.elementComment);
        }
    }
}
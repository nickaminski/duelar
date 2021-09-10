import { Injectable, Injector, ComponentFactoryResolver, EmbeddedViewRef, ApplicationRef, ComponentRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DomService {

  private childComponentRef: any;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) { }

  public appendComponentTo(parentId: string, child: any, childConfig?: ChildConfig): ComponentRef<unknown> {
    const childComponentRef = this.componentFactoryResolver
                                  .resolveComponentFactory(child)
                                  .create(this.injector);

    this.attachConfig(childConfig, childComponentRef);

    this.childComponentRef = childComponentRef;

    this.appRef.attachView(childComponentRef.hostView);

    const childDomElem = (childComponentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;

    document.getElementById(parentId).appendChild(childDomElem);

    return childComponentRef;
  }

  public removeComponent() {
    if (this.childComponentRef) {
      this.appRef.detachView(this.childComponentRef.hostView);
      this.childComponentRef.destroy();
    }
  }

  private attachConfig(config, componentRef) {
    const inputs = config.inputs;
    const outputs = config.outputs;

    for (const key of Object.keys(inputs)) {
      componentRef.instance[key] = inputs[key];
    }

    for (const key of Object.keys(outputs)) {
      componentRef.instance[key] = outputs[key];
    }
  }
}

interface ChildConfig {
  inputs: object;
  outputs: object;
}
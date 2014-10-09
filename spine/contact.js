(function(global){
    //Model
    //新建
    var Contact = Spine.Model.setup("Contact", [firstName, lastName, email]);
    //加入本地存储
    Contact.extend(Spine.Model.Local);
    //添加实例方法
    Contact.include({
        fullName : function () {
            if (!this.fullName && !this.lastName) { return; }
            return this.fullName + " " + this.lastName;
        }
    });
    
    //Control
    $(function($) {
        var Sidebar = Spine.Control.create({
            elements: {
                ".items": this.items
            },
            events : {
                "click button" : this.create
            },
            proxied: ["render"],
            template: function (items) {
                return $("#contactTemplate").tmpl(items);
            },
            init: function () {
                this.list = Spine.List.init({
                    el : this.items,
                    template: this.template
                });
                
                this.list.bind("change", this.proxy(function(item) {
                    this.App.trigger("show:contact", item);
                }));
                
                this.App.bind("show:contact edit:contact", this.list.change);
                
                Contact.bind("refresh change" , this.render);
            },
            render: function () {
                var items = Contact.all();
                this.list.render(items);
            },
            create: function () {
                var item = Contact.create();
                this.app.trigger("edit:contact", item);
            }
        });
    });
    
    
    //View
})(this);
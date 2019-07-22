import { AdminService } from '../service/admin.service';
import { ApiService } from '../service/api.service';
import { Input } from '@angular/core';
import { FormControl, FormGroup, FormArray } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

import * as _ from 'underscore';
import jsonpatch from 'fast-json-patch';


//   "network": {
//     "wan": {
//       "eth1": {
//         "mode": "static",
//         "static": {
//           "ip": "10.30.16.99",
//           "gateway": "10.30.16.1",
//           "netmask": "255.255.255.0"
//         },
//         "dns": {
//           "server": ["168.95.1.1", "8.8.4.4"]
//         }
//       }
//     },
//     "lan": {
//       "br0": {
//         "dhcp": {
//           "start": "172.16.0.2",
//           "end": "172.16.3.250",
//           "leaseTime": "86400",
//           "gateway": "172.16.0.1",
//           "netmask": "255.255.252.0",
//           "dnsServer": ["168.95.1.1", "8.8.8.8"]
//         },
//         "net": {
//           "mode": "static",
//           "ip": "172.16.0.1",
//           "gateway": "172.16.0.1",
//           "netmask": "255.255.252.0"
//         }
//       }
//     }
//   },
//   "system": {
//     "name": "iiot",
//     "password": "iiotadmin",
//   }
// }

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  myForm: FormGroup;
  config;
  wanInterfaces;
  selectedWanInterface;
  isUpdating;
  @Input() verifyPassword: string;

  constructor(private api: ApiService, public admin: AdminService) { }

  ngOnInit() {

    this.verifyPassword = '';
    this.isUpdating = false;

    /*this.myForm = new FormGroup({
      'network': new FormGroup({

        'wan': new FormGroup({
          'eth1': new FormGroup({
            'mode': new FormControl('dhcp'),
            'static': new FormGroup({
              'gateway': new FormControl(null),
              'netmask': new FormControl(null),
              'ip': new FormControl(null)
            }),
            'dns': new FormGroup({
              'server': new FormArray([
                new FormControl(null),
                new FormControl(null)
              ])
            })
          }),
          'eth2': new FormGroup({
            'mode': new FormControl('dhcp'),
            'static': new FormGroup({
              'gateway': new FormControl(null),
              'netmask': new FormControl(null),
              'ip': new FormControl(null)
            }),
            'dns': new FormGroup({
              'server': new FormArray([
                new FormControl(null),
                new FormControl(null)
              ])
            })
          })
        }),

        'lan': new FormGroup({
          'br0': new FormGroup({
            'dhcp': new FormGroup({
              'start': new FormControl(null),
              'end': new FormControl(null),
              'leaseTime': new FormControl(null),
              'gateway': new FormControl(null),
              'netmask': new FormControl(null),
              'dnsServer': new FormArray([
                new FormControl(null),
                new FormControl(null)
              ])
            }),
            'net': new FormGroup({
              'mode': new FormControl(null),
              'ip': new FormControl(null),
              // 'gateway': new FormControl(null),
              'netmask': new FormControl(null)
            }),
            'whiteip': new FormGroup({
              'start': new FormControl(null),
              'ends': new FormControl(null)
            }),
            'httpsAllow': new FormControl(true)
          })
        })
      }),

      'system': new FormGroup({
        'account': new FormGroup({
          'name': new FormControl(null),
          'password': new FormControl('')
        })
      })
    });*/


    this.getConfg();
  }

  initFormData(config) {

    // wan interfaces
    const wan = {};
    for (const it in config.network.wan) {
      if (config.network.wan.hasOwnProperty(it)) {
        wan[it] = new FormGroup({
          'mode': new FormControl('dhcp'),
          'static': new FormGroup({
            'gateway': new FormControl(null),
            'netmask': new FormControl(null),
            'ip': new FormControl(null)
          }),
          'dns': new FormGroup({
            'server': new FormArray([
              new FormControl(null),
              new FormControl(null)
            ])
          })
        });
      }
    }

    this.myForm = new FormGroup({
      'network': new FormGroup({

        'wan': new FormGroup(wan),

        'lan': new FormGroup({
          'br0': new FormGroup({
            'dhcp': new FormGroup({
              'start': new FormControl(null),
              'end': new FormControl(null),
              'leaseTime': new FormControl(null),
              'gateway': new FormControl(null),
              'netmask': new FormControl(null),
              'dnsServer': new FormArray([
                new FormControl(null),
                new FormControl(null)
              ])
            }),
            'net': new FormGroup({
              'mode': new FormControl(null),
              'ip': new FormControl(null),
              // 'gateway': new FormControl(null),
              'netmask': new FormControl(null)
            }),
            'whiteip': new FormGroup({
              'start': new FormControl(null),
              'ends': new FormControl(null)
            }),
            'httpsAllow': new FormControl(true)
          })
        })
      }),

      'system': new FormGroup({
        'account': new FormGroup({
          'name': new FormControl(null),
          'password': new FormControl('')
        })
      })
    });


    // get network interfaces of wan
    this.wanInterfaces = Object.keys(this.config.network.wan);
    if (this.wanInterfaces.length) {
      this.selectedWanInterface = this.wanInterfaces[0];
    }
  }

  onSubmit() {
    console.log(this.myForm.value, this.config);
    this.isUpdating = true;

    let diff = jsonpatch.compare(this.config, this.myForm.value);
    diff = _.filter(diff, function(item) {
        return item.op !== 'remove';
      });
    jsonpatch.applyPatch(this.config, diff).newDocument;

    console.log(diff, this.config);
    this.api.setConfig(this.config).subscribe(
      result => {
        console.log('main > setConfg done', result);
        this.isUpdating = false;
        this.admin.successAlert('Updated Successfully!');
      },
      error => {
        console.error('main > setConfg error', error);
        this.isUpdating = false;
        this.admin.errorAlert(error);
      }
    );
  }

  getConfg() {
    this.api.getConfig().subscribe(
      result => {
        console.log('main > getConfg done', result);
        this.verifyPassword = result.system.account.password;
        this.config = result;

        // initialize network interface for myForm
        this.initFormData(this.config);

        this.myForm.patchValue(result);
      },
      error => {
        console.error('main > getConfg error', error);
      }
    );
  }

}

# Testing opa + CDK (ts)

Using opa with CDK allows us to define constraints to the generated infrastructure. For instance, one can limit the number of instances created, prohibit instances to allow ssh access, enforce usage of tags or literally everything you can think of.

This repo follows the [Realize policy as code with AWS Cloud Development Kit through Open Policy Agent](https://aws.amazon.com/blogs/opensource/realize-policy-as-code-with-aws-cloud-development-kit-through-open-policy-agent/) article, but with TS.

The cloudformation generated by this CDK stack has an EC2 instance with open SSH access, so when running you'll the the rule `deny_ssh_enabled` defined in [opa_cdk.rego](./opa_cdk.rego) will fail.

Running:

```sh
yarn synth
yarn opa
```
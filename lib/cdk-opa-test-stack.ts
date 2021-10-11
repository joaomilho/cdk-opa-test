import * as cdk from "@aws-cdk/core";
import * as ec2 from "@aws-cdk/aws-ec2";

export class CdkOpaTestStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const vpc = new ec2.Vpc(this, "VPC");

    const mySecurityGroup = new ec2.SecurityGroup(this, "SecurityGroup", {
      vpc,
      description: "Allow ssh access to ec2 instances",
      allowAllOutbound: true, // Can be set to false
    });
    mySecurityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(22),
      "allow ssh access from the world"
    );

    new ec2.Instance(this, "Instance", {
      vpc,
      instanceType: new ec2.InstanceType("t3.small"),
      machineImage: ec2.MachineImage.latestAmazonLinux(),
      // Showing the most complex setup, if you have simpler requirements
      // you can use `CloudFormationInit.fromElements()`.
      init: ec2.CloudFormationInit.fromConfigSets({
        configSets: {
          // Applies the configs below in this order
          default: ["yumPreinstall", "config"],
        },
        configs: {
          yumPreinstall: new ec2.InitConfig([
            // Install an Amazon Linux package using yum
            ec2.InitPackage.yum("git"),
          ]),
          config: new ec2.InitConfig([
            // Create a JSON file from tokens (can also create other files)
            // ec2.InitFile.fromObject("/etc/stack.json", {
            //   stackId: stack.stackId,
            //   stackName: stack.stackName,
            //   region: stack.region,
            // }),

            // Create a group and user
            ec2.InitGroup.fromName("my-group"),
            ec2.InitUser.fromName("my-user"),

            // Install an RPM from the internet
            ec2.InitPackage.rpm(
              "http://mirrors.ukfast.co.uk/sites/dl.fedoraproject.org/pub/epel/8/Everything/x86_64/Packages/r/rubygem-git-1.5.0-2.el8.noarch.rpm"
            ),
          ]),
        },
      }),
      initOptions: {
        // Optional, which configsets to activate (['default'] by default)
        configSets: ["default"],

        // Optional, how long the installation is expected to take (5 minutes by default)
        timeout: cdk.Duration.minutes(30),

        // Optional, whether to include the --url argument when running cfn-init and cfn-signal commands (false by default)
        includeUrl: true,

        // Optional, whether to include the --role argument when running cfn-init and cfn-signal commands (false by default)
        includeRole: true,
      },
    });

    // The code that defines your stack goes here
  }
}

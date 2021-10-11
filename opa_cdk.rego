package opa_cdk

import input 

# deny if it creates more than 10 EC2 instances
deny_too_many_ec2[deny] {                             
    instances := [res | res:=input.Resources[_]; res.Type == "AWS::EC2::Instance"]   
    count(instances) > 10  
    deny := true
}

# deny if ssh is enabled
deny_ssh_enabled[deny] {                             
    input.Resources[_].Properties.SecurityGroupIngress[_].ToPort == 22
    deny := true
}

# deny if it creates IAM role
deny_role_created[deny] {                             
    input.Resources[_].Type == "AWS::IAM::Role"
    deny := true
}

provider "oci" {}

resource "oci_core_instance" "generated_oci_core_instance" {
	agent_config {
		is_management_disabled = "false"
		is_monitoring_disabled = "false"
		plugins_config {
			desired_state = "DISABLED"
			name = "Vulnerability Scanning"
		}
		plugins_config {
			desired_state = "ENABLED"
			name = "Custom Logs Monitoring"
		}
		plugins_config {
			desired_state = "ENABLED"
			name = "Compute Instance Monitoring"
		}
		plugins_config {
			desired_state = "DISABLED"
			name = "Bastion"
		}
	}
	availability_config {
		recovery_action = "RESTORE_INSTANCE"
	}
	availability_domain = "ufTk:AP-SEOUL-1-AD-1"
	compartment_id = "ocid1.tenancy.oc1..aaaaaaaarfs6jjowfun3tew7xgszhu2yyvonq4hqjmej7ubg4zaqhbubdnta"
	create_vnic_details {
		assign_private_dns_record = "true"
		assign_public_ip = "true"
		subnet_id = "ocid1.subnet.oc1.ap-seoul-1.aaaaaaaaff5ct55zki6dihnqakwqri4hsoykboshunt2il6npm77veqenpia"
	}
	display_name = "arm服务器"
	instance_options {
		are_legacy_imds_endpoints_disabled = "false"
	}
	metadata = {
		"ssh_authorized_keys" = "ssh-rsa AAAAB3NzaC1yc2EAAAABIwAAAQEAu/hebYs4PkQdJgmh4l0VR4IrHeOR2XPLoKQzpVxynaSHNO/GXt42tfuNPwXNvM8Km5C2stIFkCw/H0tXtl+c9jNbC8gNwd/Z03IDX8pPCX/88hk2Mjhe6yiG7Ob+JdRFWAXVoqu63rSJp5x5VsHgVGPjueCudAYpqR29a+QlqTJ4G0wKI9b+Ne+PqhH0OG9647J081qo9PPaGB9PVOg1JRYuRPjmYiCxnkUk7/5LXnP7ydBZ3XsVZ94k0Ldfq5E7QzrJkUplrMd2WcIrOOoqoC+2VahKxjydpq9k9z93hzyvpVmNk9wdTBpNRURzMiFZaZuwnCtB56y3soYZzr003w=="
	}
	shape = "VM.Standard.A1.Flex"
	shape_config {
		memory_in_gbs = "24"
		ocpus = "4"
	}
	source_details {
		boot_volume_size_in_gbs = "100"
		source_id = "ocid1.image.oc1.ap-seoul-1.aaaaaaaaevkv5zqh33bcheyn6fdcqb3g5f37amfqsxyg4tc2xzyrstk3bwma"
		source_type = "image"
	}
}

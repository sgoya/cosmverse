import * as React from "react"
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Textarea,
  useToast,
} from "@chakra-ui/react"
import { FileUpload } from "../../components/file-upload"
import { useSdk } from "../../services/client/wallet";
import { unSanitizeIpfsUrl, uploadFile } from "../../services/ipfs/client";
import { Bech32, toHex } from "@cosmjs/encoding";
import { useState } from "react";
import { config } from "../../../config";

function generateId(address: string) {
  // TODO: Format ID?
  const pubkey = toHex(Bech32.decode(address).data);
  return (
    pubkey?.substr(2, 10) +
    pubkey?.substring(pubkey.length - 8) +
    '-' +
    Math.random().toString(36).substr(2, 9)
  ).toUpperCase();
}

export const Create = () => {
  const toast = useToast();
  const { getSignClient, address } = useSdk();
  const [files, setFiles] = useState<File[]>();
  const [nftName, setNftName]= useState<string>();
  const [description, setDescription]= useState<string>();

  async function createNft(e: any) {
    // TODO: use formik validations
    e.preventDefault();

    if (!address) {
      toast({
        title: "Account required.",
        description: "Please connect wallet.",
        status: "warning",
        position: "top",
        isClosable: true,
      });

      return;
    }

    console.log(files, nftName, description);
    if (!files || files.length == 0) {
      return;
    }

    // TODO: Show ID after load page
    const nftId = generateId(address);

    try {
      const fileHash = await uploadFile(files[0]);
      console.log(fileHash, nftId);
      const msg = {
        mint: {
          token_id: nftId,
          owner: address,
          name: nftName,
          description: description,
          image: unSanitizeIpfsUrl(fileHash)
        }
      };

      const client = getSignClient();
      const result = await client?.execute(address, config.contract, msg);

      console.log(result);
    } catch (error) {
      toast({
        title: "Error",
        description: error,
        status: "error",
        position: "bottom-right",
        isClosable: true,
      });
    }
  }

  return (
  <Flex
    py={{ base: 5 }}
    px={{ base: 4 }}
    justifyContent="center"
    alignItems="center"
    direction="row">
    <Box maxW="500px" w="100%">
      <Box>
        <Box mt={6} mb={10}>
          <Heading as="h3" fontSize="3xl">Create a single NFT</Heading>
        </Box>
        <Box as={'form'} id="nft-form" onSubmit={createNft}>
        <Box>
            <FormControl id="name" isRequired>
              <FormLabel
                fontSize="sm"
                fontFamily="mono"
                fontWeight="semibold"
              >Image</FormLabel>
              <FileUpload accept="image/*" onDrop={acceptedFiles => setFiles(acceptedFiles)} />
            </FormControl>
          </Box>
          <Box mt={4}>
            <FormControl id="name" isRequired>
              <FormLabel
                fontSize="sm"
                fontFamily="mono"
                fontWeight="semibold"
              >Name</FormLabel>
              <Input name="name" onChange={e => setNftName(e.target.value)} />
            </FormControl>
          </Box>
          <Box mt={4}>
            <FormControl id="description">
              <FormLabel
                fontSize="sm"
                fontFamily="mono"
                fontWeight="semibold"
              >Description</FormLabel>
              <Textarea name="description" placeholder="NFT description" onChange={e => setDescription(e.target.value)} />
            </FormControl>
          </Box>
          <Box mt={6}>
            <Button
              type="submit"
              height="var(--chakra-sizes-10)"
              fontSize={'md'}
              fontWeight="semibold"
              borderRadius={'50px'}
              color={'white'}
              bg="pink.500"
              _hover={{
                bg: "pink.700",
              }}>
              Create
            </Button>
          </Box>
        </Box>
      </Box>

    </Box>
  </Flex>
  );
}

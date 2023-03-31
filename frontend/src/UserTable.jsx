import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Box,
    Grid,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    MenuItem,
    TextField,
    Button,
    Slider
} from "@material-ui/core";

function UserTable() {
    const [users, setUsers] = useState([]);
    const [region, setRegion] = useState('USA');
    const [seed, setSeed] = useState(0);
    const [numErrors, setNumErrors] = useState(0.0);
    const [sliderValue, setSliderValue] = useState(0);

    const handleRegionChange = (event) => {
        setRegion(event.target.value);
    };
    const handleSeedChange = (event) => {
        setSeed(event.target.value);
    };

    const handleRandomSeedClick = () => {
        setSeed(Math.floor(Math.random() * 1000000));
    };

    const handleNumErrorsChange = (event) => {
        var value = checkErrorsNum(event.target.value);
        setNumErrors(value);
        setSliderValue(Math.min(value, 10));
    };

    const handleSliderErrorsChange = (event, value) => {
        var fixed_value = checkErrorsNum(value);
        setNumErrors(fixed_value);
        setSliderValue(fixed_value);
    }
    const checkErrorsNum = (num) => {
        if (!num || num < 0) {
            return 0;
        } else if (num > 1000) {
            return 1000;
        } else return num;
    }

    const getUsers = async (num, offset = 0) => {
        try {
            const data = {
                "count": num,
                "offset": offset,
                "errors": numErrors,
                "seed": seed,
                "country": region
            };
            const url = process.env.REACT_APP_SERVER_URL;
            const response = await axios.post(url, data);

            return response.data;
        }
        catch (error) { console.error(error); return [] };
    }


    useEffect(() => {
        const fetchUsers = async () => {
            var users = await getUsers(20);
            setUsers(users);
        };
        fetchUsers();
    }, [numErrors, region, seed]);

    const handleTableScroll = async (event) => {
        const target = event.target;
        if (target.scrollHeight - target.scrollTop === target.clientHeight) {
            var newUsers = await getUsers(10, users.length);
            setUsers(users.concat(newUsers));
        }

    }

    return (
        <Box m={20} style={{ padding: 20, overflow: 'hidden' }} >
            <Grid style={{ position: 'sticky', top: 0, backgroundColor: 'white' }} container alignItems="center" spacing={2}>
                <Grid item s>
                    <Box minWidth={2}>
                        <TextField
                            select
                            label="Region"
                            value={region}
                            onChange={handleRegionChange}
                            variant="outlined"
                        >
                            <MenuItem value="France">France</MenuItem>
                            <MenuItem value="USA">USA</MenuItem>
                            <MenuItem value="Russia">Russia</MenuItem>
                            <MenuItem value="China">China</MenuItem>
                        </TextField>
                    </Box>
                </Grid>
                <Grid item s>
                    <Box ml={2}>
                        <TextField
                            label="Seed"
                            variant="outlined"
                            size="small"
                            value={seed}
                            onChange={handleSeedChange}
                        />
                    </Box>
                </Grid>
                <Grid item s>
                    <Button variant="contained" color="primary" onClick={handleRandomSeedClick}>
                        Generate Seed
                    </Button>
                </Grid>
                <Grid item s>
                    <Box display="flex" alignItems="center">
                        <Typography>Number of Errors:</Typography>
                        <Box ml={2}>
                            <Slider
                                size="small"
                                aria-label="Small"
                                value={sliderValue}
                                onChange={handleSliderErrorsChange}
                                valueLabelDisplay="auto"
                                step={0.25}
                                min={0.0}
                                max={10.0}
                            />
                        </Box>
                    </Box>
                </Grid>
                <Grid item s>
                    <TextField
                        value={numErrors}
                        onChange={handleNumErrorsChange}
                        inputProps={{
                            min: 0,
                            max: 1000,
                            type: "number",
                        }}
                    />
                </Grid>
            </Grid>
            <TableContainer style={{ maxHeight: 850 }} onScroll={handleTableScroll}>
                <Table
                    style={{ overflow: 'auto' }}
                    stickyHeader
                >
                    <TableHead>
                        <TableRow>
                            <TableCell>№</TableCell>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Address</TableCell>
                            <TableCell>Phone</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user, index) => (
                            <TableRow key={index}>
                                <TableCell>{user.number}</TableCell>
                                <TableCell>{user.id}</TableCell>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.address}</TableCell>
                                <TableCell>{user.phone}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

export default UserTable;